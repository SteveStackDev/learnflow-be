import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Problem from "#models/problem.js";
import userProblem from "#models/userProblem.js";
import User from "#models/user.js";
import mongoose from "mongoose";

class problemService {
  async getAllProblems() {
    try {
      const problems = await Problem.find().sort({ createdAt: 1, _id: 1 }).lean();
      return problems.map((p, index) => {
        const orderNum = index + 1;
        const code = p.code || String(orderNum).padStart(2, "0");
        return {
          ...p,
          order: orderNum,
          code,
        };
      });
    } catch (error) {
      console.error("Lỗi getAllProblems:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }

  async getUserProblems(req) {
    try {
      const userId =
        req.session?.passport?.user?.id ||
        req.session?.passport?.user?._id ||
        req.user?._id ||
        req.user?.id;
      if (!userId) return [];

      const allProblems = await Problem.find().sort({ createdAt: 1, _id: 1 }).lean();
      const problemOrderMap = new Map();
      allProblems.forEach((p, idx) => {
        problemOrderMap.set(String(p._id), idx + 1);
        if (p.id) problemOrderMap.set(String(p.id), idx + 1);
      });

      const query = mongoose.isValidObjectId(userId)
        ? { $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { userId: String(userId) }] }
        : { userId };

      const problems = await userProblem
        .find(query)
        .populate("problemId")
        .sort({ createdAt: -1 })
        .lean();

      return problems.map((item) => {
        if (item.problemId) {
          const pId = String(item.problemId._id || item.problemId.id);
          const orderNum = problemOrderMap.get(pId) || 1;
          item.problemId.order = orderNum;
          item.problemId.code = item.problemId.code || String(orderNum).padStart(2, "0");
        }
        return item;
      });
    } catch (error) {
      console.error("Lỗi getUserProblems:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }

  async getProblem(req) {
    try {
      const id = req?.params?.id || req;
      const allProblems = await Problem.find().sort({ createdAt: 1, _id: 1 }).lean();

      const foundIndex = allProblems.findIndex(
        (p) =>
          String(p._id) === String(id) ||
          String(p.id) === String(id) ||
          String(p.code || "").toLowerCase() === String(id).toLowerCase() ||
          String(p.title || "").toLowerCase() === String(id).toLowerCase() ||
          (String(id).length <= 4 && (
            String(p.code) === String(id) ||
            String(allProblems.indexOf(p) + 1).padStart(2, "0") === String(id) ||
            String(allProblems.indexOf(p) + 1) === String(id)
          ))
      );

      if (foundIndex !== -1) {
        const problem = allProblems[foundIndex];
        const orderNum = foundIndex + 1;
        return {
          ...problem,
          order: orderNum,
          code: problem.code || String(orderNum).padStart(2, "0"),
        };
      }

      return null;
    } catch (error) {
      console.error(`Lỗi getProblem (id: ${req?.params?.id || req}):`, error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problem thất bại",
      );
    }
  }

  async saveProblem(req) {
    try {
      const userId =
        req.body?.userId ||
        req.session?.passport?.user?.id ||
        req.session?.passport?.user?._id ||
        req.user?._id ||
        req.user?.id;

      const problemId = req.body?.problemId;

      // Chuẩn hóa mảng testResults đảm bảo đúng testResultSchema (có order)
      const formattedTestResults = Array.isArray(req.body?.testResults)
        ? req.body.testResults.map((t, index) => ({
          order: Number(t.order ?? t.id ?? index + 1),
          label: String(t.label || `Test #${index + 1}`),
          status: String(t.status || "WA"),
          score: Number(t.score ?? 0),
          maxScore: Number(t.maxScore ?? t.max_score ?? 10),
          time: Number(t.time ?? t.executionTime ?? 0),
          runtime: String(t.runtime ?? `${t.time || 0}ms`),
          memory: String(t.memory ?? "0KB"),
          input: String(t.input || ""),
          stdout: String(t.stdout || ""),
          stderr: String(t.stderr || ""),
          expected: String(t.expected || ""),
          is_hidden: Boolean(t.is_hidden ?? t.isHidden ?? false),
          subtask_id: t.subtask_id ?? t.subtaskId ?? index + 1,
          subtask_name: String(t.subtask_name ?? t.subtaskName ?? "Subtask 1"),
        }))
        : [];

      // Chuẩn hóa mảng subtasksResult đảm bảo đúng subtaskResultSchema (có order)
      const formattedSubtasksResult = Array.isArray(req.body?.subtasksResult)
        ? req.body.subtasksResult.map((st, index) => ({
          order: String(st.order ?? st.id ?? index + 1),
          title: String(st.title ?? st.name ?? `Subtask ${index + 1}`),
          label: String(st.label ?? `Subtask #${index + 1}`),
          status: String(st.status || "WA"),
          earnedScore: Number(st.earnedScore ?? st.score ?? 0),
          maxScore: Number(st.maxScore ?? st.max_score ?? 100),
          maxTime: String(st.maxTime ?? "0ms"),
          maxMemory: String(st.maxMemory ?? "0KB"),
          tests: Array.isArray(st.tests)
            ? st.tests.map((t, tIdx) => ({
              order: Number(t.order ?? t.id ?? tIdx + 1),
              label: String(t.label || `Test #${tIdx + 1}`),
              status: String(t.status || "WA"),
              score: Number(t.score ?? 0),
              maxScore: Number(t.maxScore ?? t.max_score ?? 10),
              time: Number(t.time ?? 0),
              runtime: String(t.runtime ?? `${t.time || 0}ms`),
              memory: String(t.memory ?? "0KB"),
              input: String(t.input || ""),
              stdout: String(t.stdout || ""),
              stderr: String(t.stderr || ""),
              expected: String(t.expected || ""),
              is_hidden: Boolean(t.is_hidden ?? false),
              subtask_id: t.subtask_id ?? index + 1,
              subtask_name: String(t.subtask_name ?? `Subtask ${index + 1}`),
            }))
            : [],
        }))
        : [];

      const safeProblemId = mongoose.isValidObjectId(problemId)
        ? new mongoose.Types.ObjectId(problemId)
        : problemId;

      const safeUserId = userId && mongoose.isValidObjectId(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      // 1. Tạo bản ghi trong UserProblem với dữ liệu đã format chuẩn
      const newSubmission = await userProblem.create({
        ...req.body,
        ...(safeUserId ? { userId: safeUserId } : {}),
        problemId: safeProblemId,
        testResults: formattedTestResults,
        subtasksResult: formattedSubtasksResult,
      });

      // 2. Thêm problemId vào mảng problems của User (nếu cả 2 là ObjectId hợp lệ)
      if (userId && mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(problemId)) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { problems: new mongoose.Types.ObjectId(problemId) },
        });
      }

      return newSubmission;
    } catch (error) {
      console.error("Lỗi khi saveProblem:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Lưu problem thất bại: ${error.message}`,
      );
    }
  }
}

export default new problemService();
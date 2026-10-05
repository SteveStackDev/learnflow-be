import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Problem from "#models/problem.js";
import ProblemTestCase from "#models/problemTestCase.js";
import userProblem from "#models/userProblem.js";
import User from "#models/user.js";
import mongoose from "mongoose";

// Helper tái cấu trúc Subtasks & TestCases từ ProblemTestCase vào Problem
async function attachTestCasesToProblem(problem) {
  if (!problem) return problem;
  const rawPId = problem._id || problem.id;
  const pIdStr = String(rawPId);

  const queryIds = [pIdStr];
  if (mongoose.isValidObjectId(rawPId)) {
    queryIds.push(new mongoose.Types.ObjectId(rawPId));
  }
  if (problem.id && problem.id !== pIdStr) {
    queryIds.push(problem.id);
  }

  const storedTests = await ProblemTestCase.find({
    problemId: { $in: queryIds },
  })
    .sort({ order: 1 })
    .lean();

  if (storedTests && storedTests.length > 0) {
    // 1. Gắn testCases phẳng
    problem.testCases = storedTests.map((t, idx) => ({
      id: t.order || idx + 1,
      order: t.order || idx + 1,
      input: t.input || "",
      expected: t.expected || "",
      points: Number(t.points) || 0,
      isHidden: Boolean(t.isHidden),
      subtaskId: t.subtaskId,
      subtaskName: t.subtaskName,
    }));

    // 2. Phân bổ vào từng subtask
    if (Array.isArray(problem.subtasks) && problem.subtasks.length > 0) {
      problem.subtasks = problem.subtasks.map((st, sIdx) => {
        const stId = st.id ?? sIdx + 1;
        const matchingTests = storedTests.filter(
          (t) =>
            String(t.subtaskId) === String(stId) ||
            String(t.subtaskName) === String(st.name) ||
            (sIdx === 0 && !t.subtaskId && !t.subtaskName)
        );

        return {
          ...st,
          testCases: matchingTests.map((t, tIdx) => ({
            id: t.order || tIdx + 1,
            input: t.input || "",
            expected: t.expected || "",
            points: Number(t.points) || 0,
            isHidden: Boolean(t.isHidden),
          })),
        };
      });
    }
  }

  return problem;
}

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
        req.query?.userId ||
        req.session?.passport?.user?.id ||
        req.session?.passport?.user?._id ||
        req.user?._id ||
        req.user?.id;

      const allProblems = await Problem.find().sort({ createdAt: 1, _id: 1 }).lean();
      const problemMap = new Map();
      allProblems.forEach((p, idx) => {
        const orderNum = idx + 1;
        const code = p.code || String(orderNum).padStart(2, "0");
        const enriched = { ...p, order: orderNum, code };
        problemMap.set(String(p._id), enriched);
        if (p.id) problemMap.set(String(p.id), enriched);
        if (p.code) problemMap.set(String(p.code), enriched);
      });

      let query = {};
      if (userId) {
        const userFilters = [
          { userId: String(userId) },
          { userId: null },
          { userId: { $exists: false } },
        ];
        if (mongoose.isValidObjectId(userId)) {
          userFilters.unshift({ userId: new mongoose.Types.ObjectId(userId) });
        }
        query = { $or: userFilters };
      }

      const problems = await userProblem
        .find(query)
        .populate("problemId")
        .sort({ createdAt: -1 })
        .lean();

      return problems.map((item) => {
        const rawPId = String(item.problemId?._id || item.problemId?.id || item.problemId || "");
        const matched = problemMap.get(rawPId) || (typeof item.problemId === "object" ? item.problemId : null);
        if (matched) {
          item.problemId = {
            ...matched,
            ...(typeof item.problemId === "object" ? item.problemId : {}),
            order: matched.order,
            code: matched.code,
          };
        }
        const sourceCode = item.sourceCode || item.submittedCode || item.code || item.codeContent || item.source_code || "";
        item.sourceCode = sourceCode;
        item.submittedCode = sourceCode;
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
        const enriched = {
          ...problem,
          order: orderNum,
          code: problem.code || String(orderNum).padStart(2, "0"),
        };
        return await attachTestCasesToProblem(enriched);
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

  async createProblem(req) {
    try {
      const data = req.body || req;
      const count = await Problem.countDocuments();
      const orderNum = count + 1;
      const code = data.code || String(orderNum).padStart(2, "0");

      const timeLimitNum = parseFloat(String(data.timeLimit || data.time_limit || "1.0").replace("s", "")) || 1.0;
      const memoryLimitNum = parseInt(String(data.memoryLimit || data.memory_limit || "256").replace("MB", "")) || 256;

      const inputDescription = data.inputDescription || (Array.isArray(data.inputFormat) ? data.inputFormat.join("\n") : (data.inputFormat || ""));
      const outputDescription = data.outputDescription || (Array.isArray(data.outputFormat) ? data.outputFormat.join("\n") : (data.outputFormat || ""));
      const constraints = Array.isArray(data.constraints)
        ? data.constraints
        : (data.constraints ? String(data.constraints).split("\n").filter(Boolean) : []);

      const newId = new mongoose.Types.ObjectId();
      const allTestCasesToInsert = [];
      let globalTestOrder = 1;

      // 1. Tách Test Cases ra khỏi Subtasks để lưu riêng từng Document (tránh vượt ngưỡng 16MB BSON Document Limit của MongoDB)
      const sanitizedSubtasks = Array.isArray(data.subtasks)
        ? data.subtasks.map((st, sIdx) => {
          const stId = st.id ?? sIdx + 1;
          const stName = st.name || `Subtask ${sIdx + 1}`;

          if (Array.isArray(st.testCases)) {
            st.testCases.forEach((tc) => {
              allTestCasesToInsert.push({
                problemId: newId,
                subtaskId: stId,
                subtaskName: stName,
                order: globalTestOrder++,
                input: String(tc.input || ""),
                expected: String(tc.expected || ""),
                points: Number(tc.points) || 0,
                isHidden: Boolean(tc.isHidden),
              });
            });
          }

          return {
            id: stId,
            name: stName,
            points: Number(st.points) || 0,
            constraints: st.constraints || "",
            testCases: [], // Giữ nhẹ Problem Document
          };
        })
        : [];

      // Dự phòng nếu data truyền testCases phẳng
      if (allTestCasesToInsert.length === 0 && Array.isArray(data.testCases)) {
        data.testCases.forEach((tc) => {
          allTestCasesToInsert.push({
            problemId: newId,
            subtaskId: tc.subtaskId || 1,
            subtaskName: tc.subtaskName || "Subtask 1",
            order: globalTestOrder++,
            input: String(tc.input || ""),
            expected: String(tc.expected || ""),
            points: Number(tc.points) || 0,
            isHidden: Boolean(tc.isHidden),
          });
        });
      }

      // 2. Tạo bản ghi Problem (nhẹ, chuẩn SEO & metadata)
      const newProblem = await Problem.create({
        _id: newId,
        id: String(newId),
        title: data.title || "Bài tập thuật toán mới",
        statement: data.statement || data.description || "",
        imageDescription: data.imageDescription || "",
        inputDescription,
        outputDescription,
        constraints,
        topic: data.topic || "Array & Hashing",
        difficulty: data.difficulty || "Easy",
        points: Number(data.points) || 500,
        status: data.status || "Active",
        timeLimit: timeLimitNum,
        memoryLimit: memoryLimitNum,
        examples: Array.isArray(data.examples) ? data.examples : [],
        subtasks: sanitizedSubtasks,
        testCases: [],
        order: orderNum,
        code,
      });

      // 3. Lưu toàn bộ các Test Cases riêng biệt vào collection ProblemTestCase (mỗi test case là 1 doc độc lập)
      if (allTestCasesToInsert.length > 0) {
        await ProblemTestCase.insertMany(allTestCasesToInsert);
      }

      const problemObj = newProblem.toObject ? newProblem.toObject() : newProblem;
      return await attachTestCasesToProblem(problemObj);
    } catch (error) {
      console.error("Lỗi khi createProblem:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Tạo bài tập thất bại: ${error.message}`,
      );
    }
  }

  async updateProblem(req) {
    try {
      const id = req.params?.id || req.body?.id || req.body?._id;
      const data = { ...(req.body || req) };

      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { _id: id }, { id: String(id) }] }
        : { $or: [{ _id: id }, { id: String(id) }] };

      if (data.timeLimit || data.time_limit) {
        data.timeLimit = parseFloat(String(data.timeLimit || data.time_limit || "1.0").replace("s", "")) || 1.0;
      }
      if (data.memoryLimit || data.memory_limit) {
        data.memoryLimit = parseInt(String(data.memoryLimit || data.memory_limit || "256").replace("MB", "")) || 256;
      }
      if (data.inputFormat) {
        data.inputDescription = Array.isArray(data.inputFormat) ? data.inputFormat.join("\n") : data.inputFormat;
      }
      if (data.outputFormat) {
        data.outputDescription = Array.isArray(data.outputFormat) ? data.outputFormat.join("\n") : data.outputFormat;
      }
      if (data.constraints) {
        data.constraints = Array.isArray(data.constraints)
          ? data.constraints
          : String(data.constraints).split("\n").filter(Boolean);
      }
      if (data.points != null) {
        data.points = Number(data.points) || 500;
      }

      const allTestCasesToInsert = [];
      let globalTestOrder = 1;
      let hasTestCasesToUpdate = false;

      // Chuẩn hóa subtasks và trích xuất test cases
      if (Array.isArray(data.subtasks)) {
        hasTestCasesToUpdate = true;
        data.subtasks = data.subtasks.map((st, sIdx) => {
          const stId = st.id ?? sIdx + 1;
          const stName = st.name || `Subtask ${sIdx + 1}`;

          if (Array.isArray(st.testCases)) {
            st.testCases.forEach((tc) => {
              allTestCasesToInsert.push({
                problemId: id,
                subtaskId: stId,
                subtaskName: stName,
                order: globalTestOrder++,
                input: String(tc.input || ""),
                expected: String(tc.expected || ""),
                points: Number(tc.points) || 0,
                isHidden: Boolean(tc.isHidden),
              });
            });
          }

          return {
            id: stId,
            name: stName,
            points: Number(st.points) || 0,
            constraints: st.constraints || "",
            testCases: [],
          };
        });
      }

      if (allTestCasesToInsert.length === 0 && Array.isArray(data.testCases)) {
        hasTestCasesToUpdate = true;
        data.testCases.forEach((tc) => {
          allTestCasesToInsert.push({
            problemId: id,
            subtaskId: tc.subtaskId || 1,
            subtaskName: tc.subtaskName || "Subtask 1",
            order: globalTestOrder++,
            input: String(tc.input || ""),
            expected: String(tc.expected || ""),
            points: Number(tc.points) || 0,
            isHidden: Boolean(tc.isHidden),
          });
        });
      }
      data.testCases = [];

      const updated = await Problem.findOneAndUpdate(query, data, { new: true }).lean();

      if (hasTestCasesToUpdate && updated) {
        const pId = updated._id || id;
        const queryIds = [String(pId)];
        if (mongoose.isValidObjectId(pId)) {
          queryIds.push(new mongoose.Types.ObjectId(pId));
        }
        await ProblemTestCase.deleteMany({ problemId: { $in: queryIds } });

        if (allTestCasesToInsert.length > 0) {
          const finalTests = allTestCasesToInsert.map((t) => ({ ...t, problemId: pId }));
          await ProblemTestCase.insertMany(finalTests);
        }
      }

      return await attachTestCasesToProblem(updated);
    } catch (error) {
      console.error("Lỗi khi updateProblem:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cập nhật bài tập thất bại: ${error.message}`,
      );
    }
  }

  async deleteProblem(req) {
    try {
      const id = req.params?.id || req;
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { _id: id }] }
        : { _id: id };

      const deleted = await Problem.findOneAndDelete(query);
      if (deleted) {
        const pId = deleted._id || id;
        const queryIds = [String(pId)];
        if (mongoose.isValidObjectId(pId)) {
          queryIds.push(new mongoose.Types.ObjectId(pId));
        }
        await ProblemTestCase.deleteMany({ problemId: { $in: queryIds } });
      }
      return deleted;
    } catch (error) {
      console.error("Lỗi khi deleteProblem:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Xóa bài tập thất bại: ${error.message}`,
      );
    }
  }
}

export default new problemService();
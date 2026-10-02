export const adaptUserProblem = (item) => {
  if (!item) return null;

  const problemDetail = item.problemId ? adaptProblem(item.problemId) : adaptProblem(item);

  const rawStatus = String(item.status || "").toUpperCase();
  let userStatus = "unsolved";
  if (["SOLVED", "AC", "ACCEPTED"].includes(rawStatus) || (item.score != null && item.maxScore != null && item.score === item.maxScore && item.maxScore > 0)) {
    userStatus = "solved";
  } else if (["ATTEMPTED", "WA", "WRONG", "TLE", "RE", "CE", "IN_PROGRESS"].includes(rawStatus) || (item.score > 0 && item.score < item.maxScore)) {
    userStatus = "attempted";
  }

  return {
    id: item._id?.toString() || item.id,
    _id: item._id || item.id,
    userStatus,
    status: rawStatus,
    score: item.score || 0,
    maxScore: item.maxScore || 100,
    createdAt: item.createdAt,
    problemId: problemDetail || {
      _id: item.problemId?._id || item.id,
      title: "Bài tập thuật toán",
      code: "---",
      difficulty: "easy",
      topic: "General",
    },
    code: problemDetail?.code || "---",
    title: problemDetail?.title || "Chưa có tên bài tập",
    difficulty: problemDetail?.difficulty || "easy",
    topic: problemDetail?.topic || "",
    acceptanceRate: problemDetail?.acceptanceRate || 0,
  };
};
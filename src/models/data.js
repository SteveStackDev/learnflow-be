import connectDB from "#configs/database.js";
import Problem from "#models/problem.js";

export const initialProblemsData = [
  {
    title: "A+B",
    statement: "Cho 2 số nguyên A, B. Tính tổng của chúng!",
    imageDescription: "",
    inputDescription: "Một dòng gồm hai số nguyên A, B",
    outputDescription: "Tổng của A và B",
    constraints: ["(1≤A,B≤1000)"],
    topic: "Array & Hashing",
    difficulty: "Easy",
    points: 500,
    status: "Active",
    timeLimit: 1.0,
    memoryLimit: 256,
    examples: [
      {
        order: 1,
        title: "Ví dụ 1:",
        input: "2 3",
        output: "5",
        explanation: "",
      },
    ],
    subtasks: [
      {
        order: 1,
        name: "Subtask 1",
        points: 500,
        constraints: "N <= 1000",
        testCases: [
          {
            input: "30 6",
            expected: "36",
            points: 100,
            isHidden: false,
          },
          {
            input: "60 7",
            expected: "67",
            points: 100,
            isHidden: false,
          },
          {
            input: "500 500",
            expected: "1000",
            points: 100,
            isHidden: false,
          },
          {
            input: "1 1",
            expected: "2",
            points: 100,
            isHidden: false,
          },
          {
            input: "75 25",
            expected: "100",
            points: 100,
            isHidden: false,
          },
        ],
      },
    ],
  },
  {
    title: "Đường đi ngắn nhất",
    statement:
      "Cho đồ thị vô hướng gồm n đỉnh và m cạnh. Tìm đường đi ngắn nhất từ 1 đến các đỉnh từ 2 đến n",
    imageDescription: "",
    inputDescription:
      "- Dòng đầu tiên gồm 2 số nguyên n,m.\n- m dòng tiếp theo, mỗi dòng gồm 2 số nguyên u,v, thể hiện có cạnh nối 2 đỉnh này.",
    outputDescription:
      "In ra n−1 số nguyên, số thứ i là độ dài đường đi ngắn nhất từ 1 đến i+1. Nếu không có đường đi đến i+1, in ra -1.",
    constraints: ["1≤n,m≤10^5", "1≤u,v≤n"],
    topic: "Graph & BFS/DFS",
    difficulty: "Hard",
    points: 1000,
    status: "Active",
    timeLimit: 1.0,
    memoryLimit: 256,
    examples: [
      {
        order: 1,
        title: "Ví dụ 1:",
        input: "5 4\n1 2\n1 3\n2 3\n4 5",
        output: "1 1 -1 -1",
        explanation: "",
      },
    ],
    subtasks: [
      {
        order: 1,
        name: "Subtask 1",
        points: 500,
        constraints: " 1 ≤ n, m ≤ 1000",
        testCases: [
          {
            input: "5 6\n1 2\n1 3\n2 3\n2 4\n3 4\n4 5",
            expected: "1 1 2 3",
            points: 167,
            isHidden: false,
          },
          {
            input: "6 4\n1 2\n2 3\n4 5\n5 6",
            expected: "1 2 -1 -1 -1",
            points: 167,
            isHidden: false,
          },
          {
            input: "4 5\n1 1\n1 2\n1 2\n2 3\n3 4",
            expected: "1 2 3",
            points: 166,
            isHidden: false,
          },
        ],
      },
      {
        order: 2,
        name: "Subtask 2",
        points: 500,
        constraints: "1 ≤ n, m ≤ 10^5",
        testCases: [
          {
            input: "10 9\n1 2\n2 3\n3 4\n4 5\n5 6\n6 7\n7 8\n8 9\n9 10",
            expected: "1 2 3 4 5 6 7 8 9",
            points: 167,
            isHidden: false,
          },
          {
            input: "12 8\n1 2\n1 3\n2 4\n3 5\n4 6\n7 8\n8 9\n10 11",
            expected: "1 1 2 2 3 -1 -1 -1 -1 -1 -1",
            points: 167,
            isHidden: false,
          },
          {
            input:
              "15 18\n1 2\n1 3\n1 4\n2 5\n3 5\n3 6\n4 7\n5 8\n6 8\n7 9\n8 10\n9 10\n10 11\n11 12\n11 13\n12 14\n13 14\n14 15",
            expected: "1 1 1 2 2 2 3 3 4 5 6 6 7 8",
            points: 166,
            isHidden: false,
          },
        ],
      },
    ],
  },
  {
    title: "Tổng tiền tố",
    statement:
      "Cho mảng A gồm n số nguyên và q truy vấn có dạng (l,r), tính tổng Al+Al+1+…+Ar.",
    imageDescription: "",
    inputDescription:
      "- Dòng đầu gồm 2 số nguyên dương n,q.\n- Dòng thứ hai gồm n số nguyên Ai.\n- Mỗi dòng trong q dòng tiếp theo gồm 2 số nguyên l,r thể hiện một truy vấn.",
    outputDescription:
      "- q dòng mỗi dòng một số nguyên là kết quả cho các truy vấn.",
    constraints: ["1≤n,q≤10^5.1≤Ai≤10^9."],
    topic: "Array & Hashing",
    difficulty: "Medium",
    points: 500,
    status: "Active",
    timeLimit: 1.0,
    memoryLimit: 256,
    examples: [
      {
        order: 1,
        title: "Ví dụ 1:",
        input: "5 3\n1 3 -2 3 4\n2 3\n1 4\n3 5",
        output: "1\n5\n5",
        explanation: "",
      },
    ],
    subtasks: [
      {
        order: 1,
        name: "Subtask 1",
        points: 500,
        constraints: "N <= 100",
        testCases: [
          {
            input: "5 3\n1 2 3 4 5\n1 3\n2 4\n1 5",
            expected: "6\n9\n15",
            points: 125,
            isHidden: true,
          },
          {
            input: "4 4\n10 20 30 40\n1 1\n2 2\n3 3\n4 4",
            expected: "10\n20\n30\n40",
            points: 125,
            isHidden: false,
          },
          {
            input:
              "5 2\n1000000000 1000000000 1000000000 1000000000 1000000000\n1 5\n2 4",
            expected: "5000000000\n3000000000",
            points: 125,
            isHidden: false,
          },
          {
            input: "10 5\n3 7 2 5 8 1 9 4 6 10\n2 5\n1 10\n4 8\n6 9\n3 3",
            expected: "22\n55\n27\n20\n2",
            points: 125,
            isHidden: false,
          },
        ],
      },
    ],
  },
];

const seedProblems = async () => {
  try {
    await connectDB();
    const result = await Problem.insertMany(initialProblemsData);
    console.log(`Đã seed thành công ${result.length} problems vào DB!`);
  } catch (error) {
    console.error("Lỗi khi seed data:", error);
  }
};

seedProblems();

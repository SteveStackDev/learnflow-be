import connectDB from "#configs/database.js";
import Course from "#models/course.js";
import Lesson from "#models/lesson.js";

function generateDescription(order, courseName) {
  return `📌 Bài giảng số ${order} - Khóa học ${courseName}

Chào mừng bạn đến với Bài ${order} trong khóa học "${courseName}". Đây là bài giảng thuộc chuỗi video hướng dẫn lập trình thực hành, giúp bạn củng cố kiến thức và nâng cao kỹ năng lập trình thực tế.

💡 Trong bài học này, bạn sẽ nắm được:
- Kiến thức cốt lõi và tư duy xử lý logic liên quan đến nội dung bài học.
- Các ví dụ minh họa và thao tác viết code thực hành chi tiết.
- Cách tối ưu code và xử lý một số lỗi thường gặp.

🎯 Hướng dẫn học tập hiệu quả:
1. Mở trình soạn thảo code (VS Code / IDE) và gõ lại code theo video thay vì chỉ ngồi xem.
2. Tạm dừng video ở các đoạn phức tạp để tự mình suy nghĩ cách giải quyết trước khi xem tiếp.
3. Tham khảo thêm tài liệu chính thức (Official Docs) nếu bài học có sử dụng thư viện ngoài.

▶️ Bạn có thể xem trực tiếp video bên trên để bắt đầu bài học ngay bây giờ!`;
}

async function updateAllLessons() {
  try {
    await connectDB();

    const lessons = await Lesson.find({}).populate("courseId");
    console.log(`🔍 Tìm thấy ${lessons.length} lessons cần cập nhật...`);

    if (lessons.length === 0) {
      console.log("Không có lesson nào!");
      return;
    }

    const bulkOps = lessons.map((lesson) => {
      const courseName =
        lesson.courseId?.title || lesson.courseId?.name || "Lập trình";
      const lessonOrder = lesson.order || 1;

      const newDescription = generateDescription(lessonOrder, courseName);

      return {
        updateOne: {
          filter: { _id: lesson._id },
          update: { $set: { description: newDescription } },
        },
      };
    });

    const result = await Lesson.bulkWrite(bulkOps);
    console.log(`🎉 Thành công! Đã cập nhật ${result.modifiedCount} lessons.`);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);
  }
}

updateAllLessons();

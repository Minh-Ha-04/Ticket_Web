import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

interface PageErrorProps {
  status?: number; // mã lỗi HTTP
  title?: string;  // tiêu đề lỗi
  subTitle?: string; // mô tả chi tiết
}

const PageError = ({
  status = 500,
  title,
  subTitle,
}: PageErrorProps) => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  // Tiêu đề mặc định dựa trên status nếu không truyền title
  const defaultTitle = {
    404: "404 - Không tìm thấy trang",
    403: "403 - Bạn không có quyền truy cập",
    500: "500 - Lỗi máy chủ",
  }[status] || `${status} - Lỗi`;

  const defaultSubTitle = subTitle || "Xin lỗi, có sự cố xảy ra. Vui lòng thử lại sau.";

  return (
    <Result
      status={status as any} // AntD Result status chỉ hỗ trợ 403,404,500
      title={title || defaultTitle}
      subTitle={defaultSubTitle}
      extra={[
        <Button type="primary" key="home" onClick={handleBackHome}>
          Quay về trang chủ
        </Button>,
      ]}
    />
  );
};

export default PageError;

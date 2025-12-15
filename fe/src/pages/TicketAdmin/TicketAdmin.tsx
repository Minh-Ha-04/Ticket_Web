import { useEffect, useState } from "react";
import { Button, Card, InputNumber, Space, Typography, Row, Col, message } from "antd";
import instance from "../../utils/axiosInstance";

const { Title, Text } = Typography;

interface Match {
  id: number;
  matchDate: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  minPrice: number | null;
}

interface SectionMatch {
  id: number; // nếu chưa tạo, id = 0
  sectionId: number;
  price: number;
  totalSeats: number;
  availableSeats: number;
  section: { id: number; name: string };
}

export default function TicketAdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [sections, setSections] = useState<SectionMatch[]>([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const res = await instance.get("/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách trận đấu");
    }
  };

  const openTicketConfig = async (match: Match) => {
    setSelectedMatch(match);
        try {
        const res = await instance.get(`/section-match/${match.id}`);
        setSections(res.data.data);   
    } catch (err) {
      console.error(err);
      message.error("Không tải được thông tin khu vực");
    }
  };

  const updatePrice = (sectionId: number, price: number) => {
    setSections((prev) =>
      prev.map((s) => (s.sectionId === sectionId ? { ...s, price } : s))
    );
  };

  const submitTickets = async () => {
    if (!selectedMatch) return;

    const payload = sections.map((s) => ({
      sectionId: s.sectionId,
      price: s.price,
      totalSeats: s.totalSeats,
    }));

    try {
      if (sections.every((s) => s.id > 0)) {
        // SectionMatch đã tồn tại → update
        await instance.put(`/section-match/${selectedMatch.id}`, {
          sections: payload,
        });
        message.success("Cập nhật giá vé thành công!");
      } else {
        // Chưa có → tạo
        await instance.post(`/section-match/${selectedMatch.id}`, {
          sections: payload,
        });
        message.success("Tạo vé thành công!");
      }
      setSelectedMatch(null);
      loadMatches();
    } catch (err) {
      console.error(err);
      message.error("Lưu giá vé thất bại!");
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Title level={3}>Quản lý vé</Title>

      {/* ===== MATCH LIST ===== */}
      <Row gutter={[16, 16]}>
        {matches.map((m) => (
          <Col xs={24} md={12} key={m.id}>
            <Card>
              <Space direction="vertical">
                <Text strong>
                  {m.homeTeam.name} vs {m.awayTeam.name}
                </Text>
                <Text type="secondary">
                  {new Date(m.matchDate).toLocaleString()}
                </Text>
                <Button type="primary" onClick={() => openTicketConfig(m)}>
                  {m.minPrice !== null ? "Chỉnh sửa giá vé" : "Tạo giá vé"}
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== CONFIG TICKET ===== */}
      {selectedMatch && (
        <Card>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Title level={4}>
              Giá vé – {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
            </Title>

            {sections.map((s) => (
              <Row key={s.sectionId} gutter={16} align="middle">
                <Col span={6}>
                  <Text strong>{s.section.name}</Text>
                </Col>
                <Col span={10}>
                  <Text type="secondary">
                    Tổng: {s.totalSeats} – Còn: {s.availableSeats}
                  </Text>
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0}
                    value={s.price}
                    onChange={(value) => updatePrice(s.sectionId, value ?? 0)}
                  />
                </Col>
              </Row>
            ))}

            <Space style={{ justifyContent: "flex-end", width: "100%" }}>
              <Button onClick={() => setSelectedMatch(null)}>Huỷ</Button>
              <Button type="primary" onClick={submitTickets} >
                Lưu giá vé
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </Space>
  );
}

export const ticketTemplate = (booking, tickets) => {
    const ticketListHtml = tickets
      .map(ticket => `<li><b>Ticket ID:</b> ${ticket.id}</li>`)
      .join("");
  
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color:#0c4bfa">🎫 Vé Xác Nhận Đặt Chỗ</h2>
  
        <p>Chào <b>${booking.userId}</b>,</p>
        <p>Cảm ơn bạn đã thanh toán. Dưới đây là thông tin chi tiết:</p>
  
        <div style="border:1px solid #ddd; padding:15px; margin-top:15px;">
          <p><b>Mã Booking:</b> ${booking.id}</p>
  
          <p><b>Các vé của bạn:</b></p>
          <ul>
            ${ticketListHtml}
          </ul>
        </div>
  
        <p style="margin-top:20px;">Chúc bạn xem trận đấu vui vẻ! ⚽</p>
      </div>
    `;
  };
  
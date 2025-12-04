import { useEffect, useState } from "react";
import instance from "../../utils/axiosInstance";

interface User {
  username: string;
  email: string;
}

interface Picture {
  id: number;
  url: string;
  type: string;
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [poster, setPoster] = useState<Picture | null>(null);
  const [ads, setAds] = useState<Picture[]>([]);

  // 🔹 Lấy thông tin user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // 🔹 Lấy poster và quảng cáo
  useEffect(() => {
    const fetchPictures = async () => {
      try {
        // Lấy poster chính
        const posterRes = await instance.get("/pictures?type=poster");
        if (posterRes.data.data.length > 0) {
          setPoster(posterRes.data.data[0]); // lấy poster đầu tiên
        }

        // Lấy danh sách quảng cáo
        const adsRes = await instance.get("/pictures?type=ad");
        setAds(adsRes.data.data);
      } catch (error) {
        console.error("Error loading images: ", error);
      }
    };

    fetchPictures();
  }, []);

  return (
    <div >

      <div style={{ flex: 3 }}>

        {/* POSTER CHÍNH */}
        {poster ? (
          <img
            src={poster.url}
            alt="Poster chính"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          />
        ) : (
          <p>Không có poster nào!</p>
        )}
      </div>

      {/* QUẢNG CÁO BÊN PHẢI */}
      <div >
        {ads.length > 0 ? (
          ads.map((ad) => (
            <img
              key={ad.id}
              src={ad.url}
              alt="Quảng cáo"
            />
          ))
        ) : (
          <p>Không có quảng cáo</p>
        )}
      </div>

    </div>
  );
}

export default Home;

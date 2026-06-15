import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
// @ts-ignore
import homeBg from "./assets/images/tua_chua_sunset_bg_1781454063037.jpg";
import {
  QrCode,
  Search,
  Heart,
  ChevronLeft,
  Star,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Phone,
  BookOpen,
  Newspaper,
  Home,
  Clock,
  Settings,
  X,
  Plus,
  Minus,
  CheckCircle,
  Building,
  ExternalLink,
  Award,
  FileCheck,
  AlertCircle,
  Check,
  CheckSquare,
  HelpCircle,
  Send,
  User,
  Share2,
  Trash2,
  Smartphone,
  Download,
  RotateCcw,
  RefreshCw,
  Eye,
  Info,
  Sliders,
  Sparkles
} from "lucide-react";

// --- Types & Interfaces ---
interface TimelineStep {
  step: number;
  title: string;
  date: string;
  image: string;
  description: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  origin: string;
  rating: number;
  ratingCount: number;
  ocopStar: number;
  image: string;
  manufactureDate: string;
  expiryDate: string;
  producerId: string;
  producerName: string;
  address: string;
  description: string;
  certificateImage?: string;
  timeline?: TimelineStep[];
}

interface Producer {
  id: string;
  name: string;
  address: string;
  products: string[];
  rating: number;
  ratingCount: number;
  image: string;
  phone: string;
  email: string;
}

interface MapRegion {
  id: string;
  name: string;
  area: number;
  mainProduct: string;
  coordinates: { x: number; y: number };
  gps: { lat: number; lng: number };
  type: string;
  description: string;
  color: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

interface GuideItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

interface ScanRecord {
  id: string;
  code: string;
  name: string;
  time: string;
  hash: string;
}

// --- High-Quality Mock Datasets ---
const PRODUCERS: Producer[] = [
  {
    id: "P001",
    name: "HTX Nông nghiệp Thanh Yên",
    address: "Huyện Điện Biên, Tỉnh Điện Biên",
    products: ["Gạo Điện Biên", "Rau sạch", "Bưởi da xanh"],
    rating: 4.8,
    ratingCount: 45,
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3825.111",
    email: "htxthanhyen.db@gmail.com"
  },
  {
    id: "P002",
    name: "HTX Cà phê Mường Ảng",
    address: "Huyện Mường Ảng, Tỉnh Điện Biên",
    products: ["Cà phê Mường Ảng", "Cà phê bột Arabica"],
    rating: 4.7,
    ratingCount: 38,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3756.222",
    email: "htxcaphemuongang@gmail.com"
  },
  {
    id: "P003",
    name: "HTX Mắc ca Tuần Giáo",
    address: "Huyện Tuần Giáo, Tỉnh Điện Biên",
    products: ["Mắc ca Tuần Giáo", "Hạt dẻ"],
    rating: 4.6,
    ratingCount: 29,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3862.333",
    email: "htxmaccatuangiao@gmail.com"
  },
  {
    id: "P004",
    name: "HTX Mật ong Điện Biên",
    address: "Tp. Điện Biên Phủ, Tỉnh Điện Biên",
    products: ["Mật ong Điện Biên", "Sáp ong nguyên chất"],
    rating: 4.9,
    ratingCount: 27,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3921.444",
    email: "matongdienbien@gmail.com"
  },
  {
    id: "P005",
    name: "HTX Chè cổ thụ Tủa Chùa",
    address: "Huyện Tủa Chùa, Tỉnh Điện Biên",
    products: ["Chè Shan Tuyết Tủa Chùa"],
    rating: 4.8,
    ratingCount: 35,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3855.999",
    email: "htxchetuachua@gmail.com"
  },
  {
    id: "P006",
    name: "HTX Bánh truyền thống Mường Lay",
    address: "Thị xã Mường Lay, Tỉnh Điện Biên",
    products: ["Bánh Khẩu Xén Mường Lay"],
    rating: 4.7,
    ratingCount: 31,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3789.888",
    email: "khauxenmuonglay@gmail.com"
  },
  {
    id: "P007",
    name: "HTX Dịch vụ Nông nghiệp Tìa Dình",
    address: "Huyện Điện Biên Đông, Tỉnh Điện Biên",
    products: ["Bí Xanh Tìa Dình"],
    rating: 4.6,
    ratingCount: 22,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3844.777",
    email: "tiadinhagri@gmail.com"
  },
  {
    id: "P008",
    name: "Tổ hợp tác Dứa mật sạch Pulau",
    address: "Huyện Mường Chà, Tỉnh Điện Biên",
    products: ["Dứa Mật Pulau"],
    rating: 4.8,
    ratingCount: 26,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3833.666",
    email: "duamatchapulau@gmail.com"
  },
  {
    id: "P009",
    name: "HTX Khoai sọ tím Sính Phình",
    address: "Huyện Tủa Chùa, Tỉnh Điện Biên",
    products: ["Khoai Sọ Tím Tủa Chùa"],
    rating: 4.7,
    ratingCount: 19,
    image: "https://images.unsplash.com/photo-1588693951121-6dc6631ad029?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3811.555",
    email: "khoasotuachua@gmail.com"
  },
  {
    id: "P010",
    name: "HTX Nông nghiệp Bản Hin, Na Son",
    address: "Huyện Điện Biên Đông, Tỉnh Điện Biên",
    products: ["Lạc Đỏ Na Son"],
    rating: 4.8,
    ratingCount: 28,
    image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3812.444",
    email: "lacdonason.db@gmail.com"
  },
  {
    id: "P011",
    name: "HTX Miến dong Mường Phăng xanh",
    address: "Thành phố Điện Biên Phủ, Tách Điện Biên",
    products: ["Miến Dong Mường Phăng"],
    rating: 4.9,
    ratingCount: 33,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600",
    phone: "0230.3899.222",
    email: "miendongmuongphang@gmail.com"
  },
  {
    id: "P012",
    name: "Cơ sở sản xuất Cà phê Hà Chung",
    address: "Khối 4, Thị trấn Mường Ảng, Huyện Mường Ảng, Tỉnh Điện Biên",
    products: ["Cà phê Hà Chung"],
    rating: 4.8,
    ratingCount: 42,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/C%C3%A0%20Ph%C3%AA%20H%C3%A0%20Trung.jpg",
    phone: "0915.253.999",
    email: "caphehachungmuongang@gmail.com"
  }
];

const PRODUCTS: Product[] = [
  {
    id: "DB001",
    code: "DB001",
    name: "Gạo Điện Biên",
    category: "Nông sản",
    origin: "Cánh đồng Mường Thanh, Điện Biên",
    rating: 4.9,
    ratingCount: 128,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/G%E1%BA%A1o%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    manufactureDate: "05/10/2026",
    expiryDate: "05/10/2027",
    producerId: "P001",
    producerName: "HTX Nông nghiệp Thanh Yên",
    address: "Huyện Điện Biên, Tỉnh Điện Biên",
    description: "Gạo Điện Biên được trồng từ những cánh đồng màu mỡ, nguồn nước sông Nậm Rốm nuôi dưỡng dồi dào phù sa. Với biên độ nhiệt ngày đêm lý tưởng của vùng núi Tây Bắc, hạt gạo hạt nhỏ dài chín đều đặn tích tụ trọn vẹn vị dẻo thơm hảo hạng đặc trưng, mềm ngọt đậm sâu ngay cả khi để nguội. Quy trình kiểm định VietGAP nghiêm ngặt, đảm bảo không tồn dư hóa chất bảo vệ thực vật.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/G%E1%BA%A1o%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    timeline: [
      {
        step: 1,
        title: "Làm đất, gieo mạ",
        date: "01/06/2026",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
        description: "Đất trồng được cày ải, bừa san phẳng kỹ lưỡng để diệt trừ mầm sâu bệnh hại. Chọn hạt giống lúa Điện Biên thuần chủng sạ đều theo mật độ khuyến cáo."
      },
      {
        step: 2,
        title: "Chăm sóc",
        date: "15/06/2026",
        image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600",
        description: "Bón phân hữu cơ vi sinh, dọn cỏ ruộng thủ công kết hợp bảo vệ thực vật dùng chế phẩm sinh học, thích ứng tiêu chuẩn VietGAP xanh."
      },
      {
        step: 3,
        title: "Thu hoạch",
        date: "20/09/2026",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
        description: "Gặt hái khi bông lúa chín vàng đều 90%. Máy gặt đập liên hợp nhanh chóng thu hồi để tránh hao hụt chất dinh dưỡng tự nhiên."
      },
      {
        step: 4,
        title: "Sơ chế",
        date: "22/09/2026",
        image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=600",
        description: "Phơi sấy lúa tươi gián tiếp đạt độ ẩm 14.5% an toàn. Xay xát tách màu bằng hệ thống thổi hơi tiên tiến sàng lọc gạo đồng loạt."
      },
      {
        step: 5,
        title: "Đóng gói",
        date: "25/09/2026",
        image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600",
        description: "Hút chân không bao bì chất lượng, tích hợp dán tem chống giả mã QR truy xuất nguồn gốc Blockchain minh bạch của Điện Biên Agri."
      }
    ]
  },
  {
    id: "DB002",
    code: "DB002",
    name: "Cà phê Mường Ảng",
    category: "Cà phê",
    origin: "Huyện Mường Ảng, Điện Biên",
    rating: 4.7,
    ratingCount: 96,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/cafe-muong-ang.jpg",
    manufactureDate: "12/03/2026",
    expiryDate: "12/03/2027",
    producerId: "P002",
    producerName: "HTX Cà phê Mường Ảng",
    address: "Huyện Mường Ảng, Tỉnh Điện Biên",
    description: "Cà phê Arabica danh tiếng Mường Ảng trồng ở vùng dốc núi cao có mây giăng mờ ảo mát mẻ quanh năm. Hạt cà phê được thu hái thủ công tuyển chọn 100% trái chín mọng, rang mộc công nghệ Hot Air hiện đại, đem lại mùi thơm nồng đượm, hậu vị chua thanh dịu kèm vị sô-cô-la say đắm.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/ca-phe-arabica-%20Muong%20Ang.jpg",
    timeline: [
      {
        step: 1,
        title: "Chăm sóc vườn cây",
        date: "05/01/2026",
        image: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&q=80&w=600",
        description: "Xới cỏ phá váng quanh gốc, bón phân hữu cơ vi sinh, tạo bạt phủ đất giữ ẩm độ rễ sâu kích nhẹ hoa bung nở."
      },
      {
        step: 2,
        title: "Hái tay hạt chín",
        date: "14/11/2026",
        image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=600",
        description: "Công nhân hái tay từng quả cà phê chín mọng 100%, đào thải hạt khô mốc tạp lẫn rác đất bám xung quanh."
      },
      {
        step: 3,
        title: "Lên men sấy lưới",
        date: "16/11/2026",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600",
        description: "Lên men ướt tách màng nhầy tự nhiên, phơi khô chậm rãi trên sạp giàn lưới mắt nhỏ dốc gió đón nắng tự nhiên."
      },
      {
        step: 4,
        title: "Rang xay kiểm vị",
        date: "25/11/2026",
        image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600",
        description: "Rang bằng máy khí nóng mộc, đóng túi zip tráng màng nhôm đa lớp khóa chặt hương dầu cà phê Tây Bắc mộc nguyên."
      }
    ]
  },
  {
    id: "DB003",
    code: "DB003",
    name: "Mắc ca Tuần Giáo",
    category: "Đặc sản",
    origin: "Huyện Tuần Giáo, Điện Biên",
    rating: 4.6,
    ratingCount: 74,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/63056080-macca-tuan-giao-1.jpg",
    manufactureDate: "18/04/2026",
    expiryDate: "18/04/2027",
    producerId: "P003",
    producerName: "HTX Mắc ca Tuần Giáo",
    address: "Huyện Tuần Giáo, Tỉnh Điện Biên",
    description: "Mắc ca Tuần Giáo có kích cỡ hạt to tròn đều, lớp vỏ gỗ khía nứt nhẹ bằng máy áp lực dễ dàng khui tách. Nhân kem bên trong trắng ngọc, béo ngậy ngọt bùi, giàu omega bồi bổ sức khỏe não bộ sáng tạo và bảo vệ tim mạch lý tưởng.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/macca-tuan-giao-2.jpg",
    timeline: [
      {
        step: 1,
        title: "Ghép cành lai giống",
        date: "20/03/2026",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        description: "Ghép mắt mầm mắc ca chọn lọc chất lượng cao lên thân gốc mẹ khỏe mạnh cứng cáp tăng thích nghi."
      },
      {
        step: 2,
        title: "Khai thác rụng cành",
        date: "10/08/2026",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
        description: "Hạt mắc ca chín rụng tự nhiên được thu nhặt kịp thời trong ngày bảo quản vỏ ẩm xanh."
      },
      {
        step: 3,
        title: "Sấy lạnh ép nứt",
        date: "15/08/2026",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
        description: "Sấy mát nhiệt độ thấp giữ cấu trúc dầu béo rồi tạo rãnh cắt nứt hạt tự động bằng máy laser chuẩn."
      }
    ]
  },
  {
    id: "DB004",
    code: "DB004",
    name: "Mật ong Điện Biên",
    category: "OCOP",
    origin: "Rừng già Điện Biên Phủ, Điện Biên",
    rating: 4.9,
    ratingCount: 68,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/m%E1%BA%ADt%20ong%20Sam%20M%E1%BB%A9n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    manufactureDate: "20/05/2026",
    expiryDate: "20/05/2028",
    producerId: "P004",
    producerName: "HTX Mật ong Điện Biên",
    address: "Tp. Điện Biên Phủ, Tỉnh Điện Biên",
    description: "Mật ong hoa rừng tự nhiên nguyên chất sánh mịn được thu hái tinh tột từ thung lũng dốc sâu Điện Biên. Mật ong có sắc vàng sẫm quyến rũ, vị ngọt lịm nồng nàn thanh mộc, có khả năng tăng đề kháng cơ thể tự nhiên hoàn mỹ.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/m%E1%BA%ADt%20ong%20Sam%20M%E1%BB%A9n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    timeline: [
      {
        step: 1,
        title: "Định vị bọng ong",
        date: "15/02/2026",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600",
        description: "Đặt thùng tổ mật tự nhiên ven rẫy hoa mọc hoang dã tránh xa khu trồng thâm canh công nghiệp có thuốc xịt thuốc trừ sâu."
      },
      {
        step: 2,
        title: "Lọc mật quay ly tâm",
        date: "25/05/2026",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
        description: "Khai thác thủ công lọc ly tâm hút sáp vụn bảo quản mật trong lu sành sạch thông thoáng."
      }
    ]
  },
  {
    id: "DB005",
    code: "DB005",
    name: "Chè San Tuyết Tủa Chùa",
    category: "OCOP",
    origin: "Cao nguyên đá Tủa Chùa, Điện Biên",
    rating: 4.8,
    ratingCount: 82,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/Che%20Shan%20Tuy%E1%BA%BFt%20-T%E1%BB%A7a%20Ch%C3%B9a.jfif",
    manufactureDate: "10/04/2026",
    expiryDate: "10/04/2028",
    producerId: "P005",
    producerName: "HTX Chè cổ thụ Tủa Chùa",
    address: "Huyện Tủa Chùa, Tỉnh Điện Biên",
    description: "Chè Shan Tuyết cổ thụ được khai thác từ những cây chè trăm tuổi sinh trưởng tự nhiên trên độ cao hơn 1400m trập trùng mây phủ tại Tủa Chùa. Búp chè mập mạp phủ một lớp lông tơ mịn trắng như tuyết. Khi pha, chè cho nước màu vàng mật ong óng ả, hương thơm nhẹ nhàng thanh khiết của núi rừng và hậu vị ngọt sâu dai dẳng khó quên.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/Che%20Shan%20Tuy%E1%BA%BFt%20-T%E1%BB%A7a%20Ch%C3%B9a.jfif",
    timeline: [
      {
        step: 1,
        title: "Thu hái búp chè",
        date: "10/03/2026",
        image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=600",
        description: "Đồng bào H'Mông thu hái thủ công búp chè một tôm hai lá vào lúc sáng sớm sương chưa tan."
      },
      {
        step: 2,
        title: "Sao diệt men",
        date: "11/03/2026",
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600",
        description: "Phân bổ búp chè ráo nước rồi tiến hành sao nhiệt nhanh đóng vai trò ngắt quá trình oxy hóa tự nhiên."
      },
      {
        step: 3,
        title: "Vò chè và làm khô",
        date: "12/03/2026",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600",
        description: "Vò nhẹ bằng tay để búp xoắn lại giữ hạt tinh dầu rồi sấy khô thủ công trên bếp củi truyền thống."
      }
    ]
  },
  {
    id: "DB006",
    code: "DB006",
    name: "Bánh Khẩu Xén Mường Lay",
    category: "Đặc sản",
    origin: "Thị xã Mường Lay, Điện Biên",
    rating: 4.7,
    ratingCount: 64,
    ocopStar: 3,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/B%C3%A1nh%20Kh%E1%BA%A9u%20X%C3%A9n%20M%C6%B0%E1%BB%9Dng%20Lay.jfif",
    manufactureDate: "25/05/2026",
    expiryDate: "25/11/2026",
    producerId: "P006",
    producerName: "HTX Bánh truyền thống Mường Lay",
    address: "Thị xã Mường Lay, Tỉnh Điện Biên",
    description: "Bánh Khẩu Xén là món bánh truyền thống độc đáo của đồng bào Thái trắng vùng Mường Lay. Được làm từ gạo nếp nương thơm dẻo hoặc sắn nương ngon sạch phối màu tự nhiên từ lá cây rừng (gấc, lá dứa, nếp cẩm). Bánh sau khi chiên phồng xốp, giòn tan rôm rả, có cả loại vị mặn ngọt cay nhẹ và vị ngọt nước mật ong bổ dưỡng nhai mê ly.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/B%C3%A1nh%20Kh%E1%BA%A9u%20X%C3%A9n%20M%C6%B0%E1%BB%9Dng%20Lay.jfif",
    timeline: [
      {
        step: 1,
        title: "Thổi xôi nấu sắn",
        date: "20/05/2026",
        image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=600",
        description: "Gạo nếp nương ngâm nước vắt sạch đem đồ xôi chín dẻo tơi tắn dồi dào dinh dưỡng."
      },
      {
        step: 2,
        title: "Giã bánh và cán mỏng",
        date: "21/05/2026",
        image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600",
        description: "Xôi nóng được đưa vào cối giã đều dẻo quánh, sau đó chia nhỏ cán phẳng thớ mỏng trên các tấm bạt tre."
      },
      {
        step: 3,
        title: "Cắt khuôn phơi khô",
        date: "22/05/2026",
        image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600",
        description: "Cắt bánh thành các miếng hình chữ nhật mộc nhỏ xinh rồi hong khô trong nắng gió lòng chảo Điện Biên."
      }
    ]
  },
  {
    id: "DB007",
    code: "DB007",
    name: "Bí Xanh Tìa Dình",
    category: "Nông sản",
    origin: "Xã Tìa Dình, Điện Biên Đông, Điện Biên",
    rating: 4.6,
    ratingCount: 48,
    ocopStar: 3,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/B%C3%AD%20xanh%20T%C3%ACa%20D%C3%ACnh%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%C3%B4ng.jpg",
    manufactureDate: "02/06/2026",
    expiryDate: "02/09/2026",
    producerId: "P007",
    producerName: "HTX Dịch vụ Nông nghiệp Tìa Dình",
    address: "Huyện Điện Biên Đông, Tỉnh Điện Biên",
    description: "Bí xanh được gieo trồng hữu cơ trọn vẹn tại rẻo cao Tìa Dình, nổi tiếng nhờ lớp phấn mịn bám ngoài vỏ rắn chắc cứng cáp. Bí có ruột đặc, ít hạt, thịt dai chắc nịnh vị ngọt dịu thanh mát. Đặc biệt bí Tìa Dình có vỏ dày thuận lợi tích trữ bảo quản tự nhiên trong nhà mát lâu gấp đôi khoai sắn thường mà không bị thối héo.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/B%C3%AD%20xanh%20T%C3%ACa%20D%C3%ACnh%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%C3%B4ng.jpg",
    timeline: [
      {
        step: 1,
        title: "Chăm bọc giàn mầm",
        date: "10/02/2026",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        description: "Gieo mầm trong bầu hữu cơ xơ dừa bón mùn ẩm tự nhiên xua tan sâu dòi hại rễ."
      },
      {
        step: 2,
        title: "Tưới giữ ẩm vùng dốc",
        date: "15/03/2026",
        image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600",
        description: "Dùng hệ thống tưới phun sương nhẹ ngậm dòng nước khe suối tự nhiên nuôi dưỡng quả mập tròn."
      },
      {
        step: 3,
        title: "Thu hoạch vận chuyển",
        date: "30/05/2026",
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600",
        description: "Cắt tay cuống quả giữ phấn bảo vệ lành lặn nướng sọt tre vận tải tản bộ vùng cao."
      }
    ]
  },
  {
    id: "DB008",
    code: "DB008",
    name: "Dứa Mật Pulau",
    category: "Nông sản",
    origin: "Bản Pulau, Xã Pu Lạp, Huyện Mường Chà, Điện Biên",
    rating: 4.8,
    ratingCount: 57,
    ocopStar: 3,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/D%E1%BB%A9a%20m%E1%BA%ADt%20Pulau%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    manufactureDate: "12/05/2026",
    expiryDate: "26/05/2026",
    producerId: "P008",
    producerName: "Tổ hợp tác Dứa mật sạch Pulau",
    address: "Huyện Mường Chà, Tỉnh Điện Biên",
    description: "Dứa mật vùng cao Pulau Mường Chà chín vàng ươm mọng đầy nước, khi khía vỏ tỏa ngát hương thơm ngào ngạt ngọt bùi. Thịt dứa có độ đường tự nhiên béo trắm cực cao, không hề gây rát lưỡi nhai nuốt nhẹ thoải mái, thích hợp ăn tươi trực tiếp hoặc làm sinh tố mật quả sấy bổ dưỡng ngọt ngào.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/D%E1%BB%A9a%20m%E1%BA%ADt%20Pulau%20%C4%90i%E1%BB%87n%20Bi%C3%AAn.jpg",
    timeline: [
      {
        step: 1,
        title: "Chọn cây chồi giống",
        date: "05/01/2026",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        description: "Lựa chọn các chồi dứa nách khỏe mạnh, không sâu bệnh từ vườn mẹ có năng suất cao."
      },
      {
        step: 2,
        title: "Thu hái trái chín",
        date: "08/05/2026",
        image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=600",
        description: "Thu hoạch thủ công từng trái dứa đạt độ chín 1/3 đến 1/2 màu vàng tươi để giữ lượng mật đường tối ưu."
      }
    ]
  },
  {
    id: "DB009",
    code: "DB009",
    name: "Khoai Sọ Tím Tủa Chùa",
    category: "Nông sản",
    origin: "Huyện Tủa Chùa, Điện Biên",
    rating: 4.7,
    ratingCount: 43,
    ocopStar: 3,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/Khoai%20S%E1%BB%8D%20T%C3%ADm%20T%E1%BB%A7a%20Ch%C3%B9a.jpg",
    manufactureDate: "15/05/2026",
    expiryDate: "15/09/2026",
    producerId: "P009",
    producerName: "HTX Khoai sọ tím Sính Phình",
    address: "Huyện Tủa Chùa, Tỉnh Điện Biên",
    description: "Khoai sọ tím trồng trên sườn núi đá dốc đứng Tủa Chùa chứa hàm lượng tinh bột dồi dào dẻo béo thơm ngon mịn màng. Ruột củ khoai loang lổ nhiều vân sợi màu tím đỏ rất bắt mắt kỳ lạ, tỏa vị bùi ngọt mọng lành nức nở đặc trưng rộn rịp khi nấu canh.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/Khoai%20S%E1%BB%8D%20T%C3%ADm%20T%E1%BB%A7a%20Ch%C3%B9a.jpg",
    timeline: [
      {
        step: 1,
        title: "Gieo mầm hốc đá",
        date: "20/12/2025",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        description: "Đặt củ giống vào các hốc đất mùn ven đá tai mèo tơi xốp, giữ ẩm bằng thảm thực vật mùn núi."
      },
      {
        step: 2,
        title: "Đào dỡ khoai sọ",
        date: "10/05/2026",
        image: "https://images.unsplash.com/photo-1588693951121-6dc6631ad029?auto=format&fit=crop&q=80&w=600",
        description: "Thu hoạch thủ công khi lá khoai lụi vàng rũ xuống, giũ sạch đất bám rồi phân loại củ mẹ củ con."
      }
    ]
  },
  {
    id: "DB010",
    code: "DB010",
    name: "Lạc Đỏ Na Son",
    category: "Nông sản",
    origin: "Thung lũng Na Son, Điện Biên Đông, Điện Biên",
    rating: 4.8,
    ratingCount: 52,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/l%E1%BA%A1c%20%C4%91%E1%BB%8F%20Na%20Son.webp",
    manufactureDate: "20/04/2026",
    expiryDate: "20/04/2027",
    producerId: "P010",
    producerName: "HTX Nông nghiệp Bản Hin, Na Son",
    address: "Huyện Điện Biên Đông, Tỉnh Điện Biên",
    description: "Hạt lạc đỏ Điện Biên Đông nức tiếng nhờ thớ hạt chắc nịch, màu đỏ gạch đỏ đậm đầy sinh khí giàu sắt vi lượng canxi quý giá. Lạc có vị béo đậm đà, thơm giòn ngậy ngọt dồi dào dầu béo tự nhiên, rất thích hợp chưng muối vừng ăn kèm cơm nếp nóng dẻo Tây Bắc.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/l%E1%BA%A1c%20%C4%91%E1%BB%8F%20Na%20Son.webp",
    timeline: [
      {
        step: 1,
        title: "Gieo hạt thung cát",
        date: "15/12/2025",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        description: "Chọn đất phù sa sông tơi xốp, gieo lạc mật độ thích hợp đón mưa xuân Tây Bắc ấm lành."
      },
      {
        step: 2,
        title: "Nhổ lạc và rửa trôi",
        date: "01/04/2026",
        image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600",
        description: "Nhổ toàn bộ ruộng lạc lúc chín đỏ vàng, rửa trôi bùn đất rồi tách hạt phơi sấy khô mát."
      }
    ]
  },
  {
    id: "DB011",
    code: "DB011",
    name: "Miến Dong Mường Phăng",
    category: "OCOP",
    origin: "Xã Mường Phăng, Tp. Điện Biên Phủ, Điện Biên",
    rating: 4.9,
    ratingCount: 65,
    ocopStar: 4,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/Mi%E1%BA%BFn%20dong%20Muong%20Ph%C4%83ng.webp",
    manufactureDate: "08/04/2026",
    expiryDate: "08/04/2027",
    producerId: "P011",
    producerName: "HTX Miến dong Mường Phăng xanh",
    address: "Thành phố Điện Biên Phủ, Tinh Điện Biên",
    description: "Miến dong được chiết lọc kỹ càng hoàn toàn từ củ dong riềng đỏ vùng đồi dốc Mường Phăng lịch sử phong trần. Sợi miến mộc màu hơi xám nhẹ tự nhiên đặc trưng không tẩy phẩm nhuộm độc, khi luộc chín cho sợi dẻo dai đàn hồi tuyệt đối ngọt lành, không nát bấy vón cục kể cả khi đun nấu hầm quá lửa.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/Mi%E1%BA%BFn%20dong%20Muong%20Ph%C4%83ng.webp",
    timeline: [
      {
        step: 1,
        title: "Nghiền bột củ dong",
        date: "15/01/2026",
        image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600",
        description: "Rửa củ thật sạch rồi cho vào cối xay nghiền bột nước ly tâm kéo lọc cặn bã lấy bột tinh ròng."
      },
      {
        step: 2,
        title: "Tráng phơi sợi miến",
        date: "20/01/2026",
        image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600",
        description: "Tráng bột chín sấy chậm trên vỉ tre sạch rồi treo sào đón gió mát mùa xuân cho khô ráo tơi bừng."
      }
    ]
  },
  {
    id: "DB012",
    code: "DB012",
    name: "Cà phê Hà Chung",
    category: "Cà phê",
    origin: "Mường Ảng, Điện Biên",
    rating: 4.8,
    ratingCount: 89,
    ocopStar: 3,
    image: "https://6a2c1da4d2c535351669e2cf.imgix.net/C%C3%A0%20Ph%C3%AA%20H%C3%A0%20Trung.jpg",
    manufactureDate: "15/04/2026",
    expiryDate: "15/04/2027",
    producerId: "P012",
    producerName: "Cơ sở sản xuất Cà phê Hà Chung",
    address: "Khối 4, Thị trấn Mường Ảng, Huyện Mường Ảng, Tỉnh Điện Biên",
    description: "Cà phê Hà Chung tự hào là thương hiệu OCOP 3 sao đặc sắc của đất dốc Mường Ảng dồi dào sương nắng Tây Bắc. Sản xuất từ 100% hạt Arabica chín mọng trải qua khâu sơ chế ướt khắt khe, sấy lưới an toàn và rang khí nóng hiện đại, đem lại mùi thơm nồng say quyến rũ dâng trào nốt hương vị chua mộc mạc nguyên chất Tây Bắc.",
    certificateImage: "https://6a2c1da4d2c535351669e2cf.imgix.net/C%C3%A0%20Ph%C3%AA%20H%C3%A0%20Trung.jpg",
    timeline: [
      {
        step: 1,
        title: "Chăm sóc & thu hái quả chín",
        date: "10/11/2026",
        image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=600",
        description: "Từ những nông hộ chăm bón hữu cơ tốt tươi, hạt quả chín tươi đỏ được hái tuyển chọn bằng tay lúc mọc sương sớm Mường Ảng."
      },
      {
        step: 2,
        title: "Sơ chế ướt tách màng",
        date: "12/11/2026",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600",
        description: "Xát tươi tách vỏ thịt quả bằng nguồn nước sạch, lên men tự nhiên làm thơm mướt hạt rồi đãi hạt lép nổi bề mặt."
      },
      {
        step: 3,
        title: "Phơi chậm sào gió",
        date: "18/11/2026",
        image: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&q=80&w=600",
        description: "Rải hạt đều trên giàn sạp đỡ cao thoáng, sấy gió tự nhiên kết hợp đảo nhẹ liên tục đến độ ẩm khô hoàn mỹ."
      },
      {
        step: 4,
        title: "Rang thổi nóng đóng túi bảo quản",
        date: "28/11/2026",
        image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600",
        description: "Thổi mộc nóng khóa nốt chua dịu trái chín nguyên bản, xả mát nhanh rồi đóng gói chân không đa màng dán dập kín."
      }
    ]
  }
];

const MAP_REGIONS: MapRegion[] = [
  {
    id: "R1",
    name: "Cánh đồng Mường Thanh - Thanh Yên",
    area: 120,
    mainProduct: "Gạo Điện Biên",
    coordinates: { x: 42, y: 55 },
    gps: { lat: 21.3283, lng: 103.0031 },
    type: "Lúa gạo",
    color: "#059669",
    description: "Vực lúa cốt lõi màu mỡ của Điện Biên, hưởng trọn phù sa sông Nậm Rốm nuôi dưỡng hạt gạo dẻo hạt mẩy thơm danh bất hư truyền."
  },
  {
    id: "R2",
    name: "Cao nguyên Mường Ảng",
    area: 85,
    mainProduct: "Cà phê Mường Ảng",
    coordinates: { x: 65, y: 38 },
    gps: { lat: 21.5152, lng: 103.2185 },
    type: "Cà phê",
    color: "#d97706",
    description: "Địa giới đồi dốc dồi dào ánh nắng xen sương ẩm lạnh đặc hữu, điều kiện thần kỳ cho cây cà phê Arabica tích tụ vị ngon mộc mạc lưu luyến."
  },
  {
    id: "R3",
    name: "Nông trường hạt Tuần Giáo",
    area: 150,
    mainProduct: "Mắc ca Tuần Giáo",
    coordinates: { x: 74, y: 15 },
    gps: { lat: 21.5956, lng: 103.4182 },
    type: "Hạt béo",
    color: "#c084fc",
    description: "Đất feralit đỏ tơi xốp, hạ tầng chăm sóc hữu cơ tạo điều kiện hoàn hảo giúp trái mắc ca lưu giữ lượng dầu béo tự nhiên vượt mức bình thường."
  },
  {
    id: "R4",
    name: "Điện Biên Phủ hữu cơ",
    area: 200,
    mainProduct: "Mật ong Điện Biên",
    coordinates: { x: 48, y: 44 },
    gps: { lat: 21.3853, lng: 103.0163 },
    type: "Mật ong rừng",
    color: "#f59e0b",
    description: "Bạt ngàn hoa dại, hoa ban sườn đá tự nhiên là căn cơ bền bỉ cho bầy ong mật xây dựng sắn sáp nặn mật chất lượng vàng rực nguyên mộc."
  },
  {
    id: "R5",
    name: "Vùng chè cổ thụ Tủa Chùa",
    area: 95,
    mainProduct: "Chè San Tuyết Tủa Chùa",
    coordinates: { x: 68, y: 10 },
    gps: { lat: 21.9167, lng: 103.3167 },
    type: "Chè cổ thụ",
    color: "#0d9488",
    description: "Những gốc chè cổ thụ hàng trăm năm tuổi mọc tự nhiên trên núi đá tai mèo Tủa Chùa cao lộng gió, sương trắng bốn mùa nuôi búp chè ngậm tuyết."
  },
  {
    id: "R6",
    name: "Bản Thái trắng Mường Lay",
    area: 30,
    mainProduct: "Bánh Khẩu Xén Mường Lay",
    coordinates: { x: 22, y: 8 },
    gps: { lat: 22.0528, lng: 103.1492 },
    type: "Bánh truyền thống",
    color: "#ec4899",
    description: "Vùng sông nước Mường Lay yên ả thơ mộng, nơi quy tụ lò bánh truyền thống sản sinh ra những mẻ bánh Khẩu Xén giòn rụm của đồng bào Thái trắng."
  },
  {
    id: "R7",
    name: "Cao nguyên xanh Tìa Dình",
    area: 75,
    mainProduct: "Bí Xanh Tìa Dình",
    coordinates: { x: 58, y: 78 },
    gps: { lat: 21.2183, lng: 103.2651 },
    type: "Nông sản sạch",
    color: "#16a34a",
    description: "Được canh tác bền vững trên dốc cao đất đỏ khô cằn ở Tìa Dình, đón nhận trọn vẹn những giọt sương mát lành và nắng sớm quang đãng giúp bí ngọt thanh ruột đặc."
  },
  {
    id: "R8",
    name: "Thung lũng dứa mật Pulau",
    area: 60,
    mainProduct: "Dứa Mật Pulau",
    coordinates: { x: 30, y: 32 },
    gps: { lat: 21.6853, lng: 103.1124 },
    type: "Trái cây vùng cao",
    color: "#eab308",
    description: "Các sườn đồi Pulau dốc đứng với biên độ nhiệt ngày đêm cực cao, là bí quyết tự nhiên giúp dứa Pulau tích trữ được lượng đường mật sánh đặc mọng nước."
  },
  {
    id: "R9",
    name: "Rẫy khoai sọ Sính Phình",
    area: 45,
    mainProduct: "Khoai Sọ Tím Tủa Chùa",
    coordinates: { x: 60, y: 12 },
    gps: { lat: 21.9542, lng: 103.3514 },
    type: "Củ dẻo bùi",
    color: "#8b5cf6",
    description: "Sự ưu ái của thổ nhưỡng núi đá vôi tai mèo Sính Phình mang lại cho củ khoai sọ tím lớp tinh bột dẻo dính đặc trưng, có vân tím đốm đỏ thơm nồng khi chín."
  },
  {
    id: "R10",
    name: "Bãi lạc đỏ Na Son",
    area: 110,
    mainProduct: "Lạc Đỏ Na Son",
    coordinates: { x: 55, y: 62 },
    gps: { lat: 21.3392, lng: 103.2144 },
    type: "Hạt ngũ cốc",
    color: "#ef4444",
    description: "Vùng đất Na Son trù phú với phù sa pha cát tơi xốp, giúp cây lạc đâm rễ bám sâu, hạt lạc đỏ chắc nịch đậm đà dồi dào chất béo tự nhiên."
  },
  {
    id: "R11",
    name: "Rừng dong riềng Mường Phăng",
    area: 130,
    mainProduct: "Miến Dong Mường Phăng",
    coordinates: { x: 50, y: 48 },
    gps: { lat: 21.4468, lng: 103.1783 },
    type: "OCOP thế mạnh",
    color: "#14b8a6",
    description: "Được sản xuất tỉ mẩn từ củ dong riềng đỏ mọc hoang dã trên các ngọn đồi ở di tích lịch sử Mường Phăng rợp bóng mát, mang lại sợi miến xám dai nguyên bản vị mộc."
  }
];

const NEWS: NewsItem[] = [
  {
    id: "N1",
    title: "Tiêu chuẩn khắt khe đạt OCOP 4 Sao Điện Biên",
    summary: "Các yêu cầu về nguồn nước tưới sạch, thảm phủ đất vi sinh hữu cơ và nhật ký chuỗi cung ứng minh bạch.",
    content: "Để đạt chứng nhận OCOP 4 sao tỉnh Điện Biên, toàn bộ nông sản chủ lực phải giải quyết 3 cấu phần tiên quyết:\n\n1. Kiểm dịch thổ nhưỡng: Lấy mẫu ruộng bảo đảm không tẩm độc chất kim loại nặng hay thạch mầm bệnh.\n2. Nhật ký canh tác: Toàn hộ xã viên ghi chú đều đặn ngày bắt đất gieo hạt, xịt bộc bằng thuốc chứa thảo mộc.\n3. Bao bì thân thiện tích chứa tem truy nguyên Blockchain chống hàng giả mạo.",
    date: "10/05/2026",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    author: "Phòng NN&PTNT"
  },
  {
    id: "N2",
    title: "Ứng dụng chuyển đổi số canh tác tại thung lũng Mường Thanh",
    summary: "Nông dân học cách dán QR Code truy xuất, cập nhật nhật ký canh tác điện tử kiểm soát độc tố.",
    content: "Chương trình dấn thân số hóa giúp nông hộ Điện Biên kết nối người mua thủ đô nhanh vượt mốc. Từng lô hàng gặt hái sở hữu một mã liên kết số, giúp xác minh thời gian đóng bao bì trực tuyến, ngăn chặn tối thiểu tệ nạn nhái hàng đặc sản Tây Bắc.",
    date: "08/06/2026",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    author: "Sở Khoa Học Công Nghệ"
  }
];

const GUIDES: GuideItem[] = [
  {
    id: "G1",
    category: "Người tiêu dùng",
    title: "Quy trình quét mã QR truy xuất nguồn gốc",
    excerpt: "Cách dùng camera điện thoại thông minh tra cứu nguồn gốc nông sản an toàn chỉ trong 3 giây.",
    content: "BƯỚC 1: Chọn tab 'Quét QR' trên ứng dụng Điện Biên Agri.\n\nBƯỚC 2: Di chuyển tâm camera ôm khít mã tem dính trên vỏ bao nông sẩn.\n\nBƯỚC 3: Màn hình tự động liên kết máy chủ trích xuất toàn bộ thời gian cấy đất chăm bón, cơ sở gia công và nguồn gốc vệ sinh giấy kiểm nghiệm."
  },
  {
    id: "G2",
    category: "Nhà sản xuất",
    title: "Đồng bộ nhật ký lên Blockchain Hệ thống",
    excerpt: "Hướng dẫn xã viên HTX thao tác máy gửi bảng chấm công, ngày bón đón sấy sản xuất nông nghiệp.",
    content: "Xã viên dùng mã tài khoản HTX được cấp để vào hệ thống, áp dụng biểu mẫu nhập tay các hành trình: Ngày bừa đất, sạ lúa, tưới bón vi sinh, và ngày hạ gặt hạt. Thông tin tự động mã khóa thành sổ cái Blockchain bảo chứng độ chân thực không thể chỉnh sửa."
  }
];


const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidMapsKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [mapViewMode, setMapViewMode] = useState<"vector" | "satellite">("satellite");
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "fullscreen">("ios");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // App interactive states
  const [favorites, setFavorites] = useState<string[]>(["DB001"]); // Gạo Điện Biên pre-favorited
  const [scansHistory, setScansHistory] = useState<ScanRecord[]>([
    { id: "S1", code: "DB001", name: "Gạo Điện Biên", time: "12/06/2026 15:45", hash: "0x8fa3...b901" }
  ]);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannerLaserPos, setScannerLaserPos] = useState<number>(0);
  const [qrManualInput, setQrManualInput] = useState<string>("");
  const [scanResultError, setScanResultError] = useState<string | null>(null);
  const [customGPS, setCustomGPS] = useState<string>("Thanh Yên, Điện Biên");
  const [networkSpeed, setNetworkSpeed] = useState<"5G" | "4G" | "3G">("5G");
  const [activeRegion, setActiveRegion] = useState<MapRegion | null>(MAP_REGIONS[0]);
  const [currentTime, setCurrentTime] = useState<string>("09:41");
  const [supportTicketSent, setSupportTicketSent] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", text: "" });

  // Update dynamic Vietnam time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Screen orientation/dimension listener to default to fullscreen on real mobiles
  useEffect(() => {
    const handleSetView = () => {
      if (window.innerWidth < 768) {
        setDeviceType("fullscreen");
      }
    };
    handleSetView();
    window.addEventListener("resize", handleSetView);
    return () => window.removeEventListener("resize", handleSetView);
  }, []);

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleSimulateScan = (code: string) => {
    setIsScanning(true);
    setScanResultError(null);
    let counter = 0;
    const interval = setInterval(() => {
      counter += 5;
      setScannerLaserPos(counter % 100);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setIsScanning(false);
      const matched = PRODUCTS.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
      if (matched) {
        // add to history
        const dateStr = new Date();
        const timeFormatted = `${String(dateStr.getDate()).padStart(2,'0')}/${String(dateStr.getMonth()+1).padStart(2,'0')}/${dateStr.getFullYear()} ${String(dateStr.getHours()).padStart(2,'0')}:${String(dateStr.getMinutes()).padStart(2,'0')}`;
        const mockHash = "0x" + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join("") + "...f" + Math.floor(Math.random()*900 + 100);
        
        setScansHistory(prev => [
          { id: "S-" + Math.random().toString(36).substr(2, 5), code: matched.code, name: matched.name, time: timeFormatted, hash: mockHash },
          ...prev
        ]);
        
        setSelectedProduct(matched);
        setShowTimeline(true); // Auto-show timeline like 'XEM QUY TRÌNH SẢN XUẤT'
        setActiveTab("products");
        setQrManualInput("");
      } else {
        setScanResultError(`Không tìm thấy mã nông sản "${code}". Hãy thử gõ DB001, DB002, DB003, DB004.`);
      }
    }, 1500);
  };

  const handleClearHistory = () => {
    setScansHistory([]);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.phone || !contactForm.name) return;
    setSupportTicketSent(true);
    setTimeout(() => {
      setSupportTicketSent(false);
      setContactForm({ name: "", phone: "", text: "" });
      alert("Đã gửi thông tin liên hệ thành công! Hợp tác xã sẽ trả lời bạn sớm nhất.");
    }, 1500);
  };

  // Filtering products
  const getFilteredProducts = () => {
    return PRODUCTS.filter(prod => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "all" || prod.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      
      {/* DESKTOP BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      {/* WEB DESKTOP HEADER BAR (Hidden if active device type is fullscreen on real mobile) */}
      {deviceType !== "fullscreen" && (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 sticky top-0 z-40 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-900/40 flex items-center justify-center">
                <QrCode className="h-6 w-6 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold font-display text-emerald-400 tracking-tight leading-none">
                    Điện Biên Agri
                  </h1>
                  <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Mobile Universal v4.2
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Mô phỏng 100% ứng dụng Android & iOS Truy xuất nguồn gốc nông sản an toàn
                </p>
              </div>
            </div>

            {/* Simulated settings controllers */}
            <div className="flex items-center space-x-3 flex-wrap">
              <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-xl flex items-center space-x-1">
                <span className="text-xs text-slate-450 px-2">Khung thiết bị:</span>
                {[
                  { id: "ios", label: "iOS (iPhone)", icon: Smartphone },
                  { id: "android", label: "Android Widget", icon: Sliders },
                  { id: "fullscreen", label: "Toàn màn hình Web", icon: Eye }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDeviceType(item.id as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                        deviceType === item.id
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50"
                          : "text-slate-405 hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTAINER WORKSPACE */}
      <div className={`flex-grow ${deviceType === "fullscreen" ? "" : "max-w-7xl mx-auto px-4 md:px-8 py-8 w-full"} grid grid-cols-1 lg:grid-cols-12 gap-8 items-start`}>
        
        {/* DESKTOP EXPLANATORY & SANDBOX DECK PANEL (Lg: col-span-5) */}
        {deviceType !== "fullscreen" && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Quick Interactive QR Sandbox scanner testbed */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center space-x-2">
                <Sparkles className="text-emerald-400 w-5 h-5" />
                <h3 className="font-bold text-base text-slate-100 font-display">
                  Kiểm Thử Tem Quét QR
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Nhấn chọn quét thử bất kỳ mã nông sản vật lý dưới đây để kích hoạt hệ thống kiểm định Blockchain trên khung ứng dụng di động:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {PRODUCTS.map(p => (
                  <button
                    key={p.code}
                    onClick={() => handleSimulateScan(p.code)}
                    disabled={isScanning}
                    className="p-2 py-3 bg-slate-950 hover:bg-emerald-950/40 hover:border-emerald-700 border border-slate-800 text-left rounded-2xl transition-all group disabled:opacity-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-200 group-hover:text-emerald-400">{p.name}</span>
                      <span className="bg-slate-850 text-slate-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                        {p.code}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 leading-none">{p.origin}</p>
                  </button>
                ))}
              </div>

              {/* Enter QR field */}
              <div className="pt-2 border-t border-slate-800/60">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (qrManualInput.trim()) handleSimulateScan(qrManualInput);
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Gõ mã quét thủ công (DB001, DB002...)"
                      value={qrManualInput}
                      onChange={(e) => setQrManualInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white placeholder:text-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isScanning || !qrManualInput.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    Tra cứu
                  </button>
                </form>
              </div>
            </div>

            {/* GPS Injector Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3.5">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <Sliders className="text-emerald-500 w-4 h-4" />
                Bộ Giả Lập Tham Số Phần Cứng
              </h3>
              
              {/* GPS Locations select */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 flex justify-between">
                  <span>Vị trí GPS trên máy (Simulated Position):</span>
                  <span className="font-bold text-emerald-400">{customGPS}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Thanh Yên, Điện Biên", "Cao nguyên Mường Ảng", "Xã Tủa Chùa", "Tuần Giáo, Điện Biên"].map(loc => (
                    <button
                      key={loc}
                      onClick={() => setCustomGPS(loc)}
                      className={`p-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        customGPS === loc 
                          ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📍 {loc.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cellular network simulator settings */}
              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Giả lập vận tốc mạng:</span>
                <div className="flex gap-1.5">
                  {(["5G", "4G", "3G"] as const).map(speed => (
                    <button
                      key={speed}
                      onClick={() => setNetworkSpeed(speed)}
                      className={`px-3 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                        networkSpeed === speed 
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MOBILE COMPILING AND DEPLOYING HANDBOOK */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <Smartphone className="text-emerald-500 w-4.5 h-4.5" />
                Cẩm Nang Xuất Bản Ứng Dụng
              </h3>
              <div className="text-xs space-y-4 text-slate-400 leading-relaxed">
                
                {/* Section 1: Smartphone Preview */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/85">
                  <p className="font-bold text-slate-300 mb-1 flex items-center gap-1 text-[11px]">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                    Xem Di Động Cạnh-To-Cạnh:
                  </p>
                  <p className="text-[11px]">
                    Mở đường dẫn ứng dụng trực tiếp bằng Safari hoặc Chrome trên điện thoại của bạn, giao diện tự động tối ưu hóa toàn màn hình không có viền máy tính ảo này.
                  </p>
                </div>

                {/* Section 2: Compile to macOS desktop .APP file */}
                <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                  <p className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    🖥️ Đóng gói thành ứng dụng macOS (.APP):
                  </p>
                  <p className="text-[11.5px] text-slate-300">
                    Để xuất bản ứng dụng web này thành một tệp máy tính <strong>macOS Desktop (.app)</strong> chạy độc lập mượt mà, hãy thực hiện qua 3 bước đơn giản:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-slate-400 pl-1 space-y-1">
                    <li>Xuất mã nguồn ZIP bằng nút ở góc trên bên phải màn hình này.</li>
                    <li>Giải nén và mở terminal tại thư mục dự án đó.</li>
                    <li>Chạy lệnh đóng gói tốc hành bằng <strong>Nativefier</strong> hoặc <strong>Electron</strong>:</li>
                  </ol>
                  
                  <div className="space-y-2 mt-2">
                    <div className="text-[10px] text-emerald-400/90 font-mono">Cách 1: Đóng gói siêu tốc bằng Nativefier (Chỉ 1 dòng lệnh)</div>
                    <pre className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-emerald-300 overflow-x-auto space-y-1 border border-slate-850">
                      <div># Cài đặt công cụ Nativefier toàn cục</div>
                      <div>npm install -g nativefier</div>
                      <div></div>
                      <div># Đóng gói URL ứng dụng của bạn thành tệp .app tương thích Mac</div>
                      <div>nativefier --name "Dien Bien Agri" --platform "mac" --arch "universal" --icon "https://6a2c1da4d2c535351669e2cf.imgix.net/C%C3%A0%20Ph%C3%AA%20H%C3%A0%20Trung.jpg" "{window.location.origin}"</div>
                    </pre>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="text-[10px] text-emerald-400/90 font-mono">Cách 2: Build Native .APP bằng Electron Forge</div>
                    <pre className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-emerald-300 overflow-x-auto space-y-1 border border-slate-850">
                      <div># 1. Cài đặt các công cụ Electron packager</div>
                      <div>npm install --dev @electron-forge/cli</div>
                      <div>npx electron-forge import</div>
                      <div></div>
                      <div># 2. Biên dịch & đóng dập tệp .app hoàn chỉnh</div>
                      <div>npm run package</div>
                      <div className="text-slate-500 font-sans text-[9px] italic mt-1">// Kết quả: Thư mục out/Dien-Bien-Agri-darwin-x64/Dien-Bien-Agri.app được tạo ra sẵn sàng kích hoạt!</div>
                    </pre>
                  </div>
                </div>

                {/* Section 3: Android & iOS wrappers */}
                <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                  <p className="font-bold text-slate-350 text-[11px] uppercase tracking-wider">Cách tự build sang APK & IPA (Di Động):</p>
                  <p className="text-[11px]">
                    Để đóng gói ứng dụng React này thành mã cài đặt Android (.apk) hoặc iOS (.ipa) bằng <strong>CapacitorJS</strong>:
                  </p>
                  <pre className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-emerald-300 overflow-x-auto space-y-1 border border-slate-850">
                    <div># 1. Cài đặt Capacitor</div>
                    <div>npm i @capacitor/core @capacitor/cli</div>
                    <div>npx cap init "Dien Bien Agri" "com.dienbien.agri"</div>
                    <div># 2. Thêm nền tảng tương ứng</div>
                    <div>npx cap add android</div>
                    <div>npx cap add ios</div>
                    <div># 3. Đồng bộ hóa mã nguồn đã biên dịch</div>
                    <div>npm run build && npx cap sync</div>
                  </pre>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* NATIVE SMARTPHONE MOCKUP FRAME CONTAINER */}
        <div className={`col-span-1 ${deviceType === "fullscreen" ? "lg:col-span-12 w-full mx-auto" : "lg:col-span-7 xl:col-span-8 flex justify-center w-full"}`}>
          
          <div className={`w-full max-w-sm shrink-0 shadow-2xl relative ${deviceType === "fullscreen" ? "max-w-none min-h-screen" : "rounded-[52px] border-[10px] border-slate-800 bg-slate-950 my-2"}`}>
            
            {/* iOS/Android Simulated Top Notch Speaker & Pinhole lens details (Hidden if Fullscreen Web) */}
            {deviceType !== "fullscreen" && (
              <>
                {deviceType === "ios" ? (
                  // Apple Notch / Dynamic Island
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-3xl z-50 flex items-center justify-between px-3">
                    <span className="w-1.5 h-1.5 bg-indigo-900/45 rounded-full" /> {/* Camera */}
                    <span className="w-14 h-1.5 bg-slate-900/60 rounded-full" /> {/* Speaker bar */}
                  </div>
                ) : (
                  // Android Pinhole Camera
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-indigo-900/40 rounded-full" />
                  </div>
                )}
                
                {/* Visual Glass Shine */}
                <div className="absolute top-0 right-4 w-12 h-full bg-white/5 skew-x-12 pointer-events-none z-40 rounded-r-3xl" />
              </>
            )}

            {/* THE PHONE CONTAINER WITH VIEWPORT SCALING */}
            <div 
              className={`bg-slate-50 text-slate-800 flex flex-col overflow-hidden relative ${
                deviceType === "fullscreen" 
                  ? "min-h-screen" 
                  : "h-[740px] rounded-[42px] shadow-inner"
              }`}
            >
              
              {/* PHONE STATUS BAR (Simulating Native Cellular indicators) */}
              <div className="h-10 bg-emerald-800 text-white flex items-center justify-between px-6 z-40 text-xs shrink-0 select-none">
                <span className="font-semibold tracking-tight">{currentTime}</span>
                
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-mono font-black border border-white/40 px-1 rounded-sm leading-none flex items-center">
                    {networkSpeed}
                  </span>
                  
                  {/* Cellular signal bars */}
                  <div className="flex items-end space-x-0.5 h-3">
                    <div className="w-0.5 h-1 bg-white rounded-full" />
                    <div className="w-0.5 h-1.5 bg-white rounded-full" />
                    <div className="w-0.5 h-2 bg-white rounded-full" />
                    <div className={`w-0.5 h-2.5 rounded-full ${networkSpeed === "3G" ? "bg-white/40" : "bg-white"}`} />
                  </div>

                  {/* WIFI Icon */}
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21l-12-12c4.4-4.4 11.6-4.4 16 0l-4 4c-.8-.8-2.2-.8-3 0l3 3zm0-18c7.7 0 14 6.3 14 14h-2c0-6.6-5.4-12-12-12s-12 5.4-12 12h-2c0-7.7 6.3-14 14-14zm0 4c5.5 0 10 4.5 10 10h-2c0-4.4-3.6-8-8-8s-8 3.6-8 8h-2c0-5.5 4.5-10 10-10z" />
                  </svg>

                  {/* Battery symbol */}
                  <div className="w-5.5 h-3 border border-white/60 rounded-sm p-0.5 flex items-center">
                    <div className="bg-white h-full w-[85%] rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* SCANNING ACTIVE SCREEN SIMULATION VISOR */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center text-white"
                  >
                    <div className="relative w-64 h-64 border-2 border-emerald-400 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-slate-900/50">
                      
                      {/* Interactive dynamic laser bar */}
                      <div 
                        className="absolute left-0 right-0 h-1 bg-red-500 shadow-lg shadow-red-500/80 z-20"
                        style={{ top: `${scannerLaserPos}%` }}
                      />

                      <QrCode className="w-32 h-32 text-emerald-400/30 animate-pulse" />

                      {/* Decors corner bounds */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                    </div>

                    <p className="text-sm font-bold font-display text-emerald-300 mt-6 tracking-wide animate-pulse">
                      VERIFYING BLOCKCHAIN LEDGER...
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Hệ thống Điện Biên Agri đang kiểm tra chứng nhận mật danh, chữ ký số nông nghiệp vùng rẫy.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MAIN CONTENT WORKSPACE VIEWPORT OF APP */}
              <div className="flex-grow overflow-y-auto overflow-x-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: HOME SCREEN (TRANG CHỦ) */}
                  {activeTab === "home" && (
                    <motion.div
                      key="tab-home"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white"
                    >
                      {/* Main visual header brand block */}
                      <div className="text-white px-5 pt-7 pb-20 rounded-b-[40.5px] items-center text-center space-y-4 relative shadow-md overflow-hidden bg-slate-950">
                        
                        {/* Leafy Sprout Green shield Logo */}
                        <div className="flex items-center justify-center space-x-2 relative z-10">
                          <div className="bg-white text-emerald-800 p-2 rounded-2xl shadow-md font-bold text-center">
                            <QrCode className="w-6 h-6 text-emerald-600 animate-pulse" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-lg font-bold font-display leading-tight uppercase tracking-wider text-white drop-shadow-md">
                              ĐIỆN BIÊN AGRI
                            </h2>
                            <p className="text-[10px] text-emerald-100 font-bold tracking-normal leading-none drop-shadow">
                              Truy xuất nguồn gốc nông sản Điện Biên
                            </p>
                          </div>
                        </div>

                        {/* Top backdrop baner image */}
                        <img 
                          src={homeBg} 
                          alt="Bản đồ ruộng bậc thang"
                          className="absolute inset-0 w-full h-full object-cover rounded-b-[40.5px] opacity-95" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/45 to-emerald-950/85 rounded-b-[40.5px]" />
                      </div>

                      {/* FLOATING ACTION BIG GREEN QR CIRCLE BUTTON */}
                      <div className="px-6 -mt-16 flex justify-center">
                        <button
                          onClick={() => handleSimulateScan("DB001")}
                          className="w-32 h-32 bg-emerald-600 active:scale-95 text-white rounded-full shadow-xl shadow-emerald-990/40 border-4 border-white flex flex-col items-center justify-center p-3 relative group transition-all duration-150"
                        >
                          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping pointer-events-none" />
                          <QrCode className="w-10 h-10 font-black animate-pulse" />
                          <span className="text-xs font-black font-display tracking-wider mt-1.5 uppercase">
                            QUÉT QR
                          </span>
                          <span className="text-[9px] text-emerald-100 font-medium tracking-normal mt-0.5 leading-none">
                            Truy xuất ngay
                          </span>
                        </button>
                      </div>

                      {/* THE 6 CORE NAVIGATION GRID LIST COMPONENT */}
                      <div className="px-6 py-6 flex-grow space-y-5">
                        
                        {/* Grid of 6 navigation buttons */}
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: "map", label: "Sơ Đồ Vùng Trồng", desc: "Định vị vệ tinh", icon: MapPin, color: "from-emerald-500 to-teal-500" },
                            { id: "products", label: "Sản Phẩm OCOP", desc: "Nguồn gốc xuất xứ", icon: Award, color: "from-cyan-500 to-blue-500" },
                            { id: "producers", label: "Hợp Tác Xã", desc: "Thành viên liên kết", icon: Building, color: "from-amber-500 to-orange-500" },
                            { id: "favorites", label: "Yêu Thích", desc: "Lưu kho nông sản", icon: Heart, color: "from-rose-500 to-pink-500" },
                            { id: "history", label: "Lập Ghi Chép", desc: "Nhật ký truy xuất", icon: Clock, color: "from-purple-500 to-indigo-500" },
                            { id: "settings", label: "Trạng Thái Hệ Thống", desc: "Thông số cấu hình", icon: Settings, color: "from-slate-500 to-slate-700" }
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveTab(item.id);
                                  setSelectedProduct(null);
                                  setSelectedProducer(null);
                                  setSelectedNews(null);
                                }}
                                className="bg-slate-50 hover:bg-slate-100 p-3.5 border border-slate-150 rounded-2xl flex flex-col items-start text-left space-y-2.5 transition-all active:scale-95 group shadow-sm cursor-pointer"
                              >
                                <div className={`p-2 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-sm`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-[11px] font-black text-slate-805 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {item.label}
                                  </h3>
                                  <p className="text-[9px] text-slate-400 mt-0.5 leading-none font-medium">
                                    {item.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Extra informational footer banner */}
                        <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/60 mt-2 space-y-1">
                          <h4 className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                            Kiểm Định OCOP 2026
                          </h4>
                          <p className="text-[10px] text-slate-550 leading-relaxed text-justify">
                            Hệ thống liên kết dữ liệu vùng nguyên liệu trà Shan Tuyết, cà phê Arabica, gạo Tám Điện Biên đạt kiểm thực tự động qua QR Code.
                          </p>
                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* TAB 2: PRODUCTS SCREEN (SẢN PHẨM & OCOP) */}
                  {activeTab === "products" && (
                    <motion.div
                      key="tab-products"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      {/* Sub-view switcher: Product specifications details vs Master products list */}
                      {selectedProduct ? (
                        <div className="space-y-4">
                          
                          {/* Back Header Nav */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <button
                              onClick={() => {
                                setSelectedProduct(null);
                                setShowTimeline(false);
                                setShowCertificate(false);
                              }}
                              className="flex items-center space-x-1 text-xs font-bold text-slate-600"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Quay lại</span>
                            </button>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">
                              Mã code: {selectedProduct.code}
                            </span>
                          </div>

                          {/* TIMELINE TAB SECTION PREVIEW OR DETAILS PREVIEW */}
                          {!showTimeline ? (
                            // SCREEN 3: CHI TIẾT SẢN PHẨM (SPECIFICATIONS TABLE LOOK)
                            <div className="space-y-4">
                              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-150">
                                <img
                                  src={selectedProduct.image}
                                  alt={selectedProduct.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={(e) => handleToggleFavorite(selectedProduct.id, e)}
                                  className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white text-red-500 border border-slate-100"
                                >
                                  <Heart className={`w-4 h-4 ${favorites.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : ""}`} />
                                </button>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-bold font-display text-slate-900 leading-none">
                                    {selectedProduct.name}
                                  </h3>
                                  <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md self-start shrink-0">
                                    OCOP {selectedProduct.ocopStar}★
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-1 pt-1.5">
                                  <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                  </div>
                                  <span className="text-xs text-slate-400 font-semibold pl-1">
                                    ({selectedProduct.ratingCount} lượt đánh giá)
                                  </span>
                                </div>
                              </div>

                              {/* STYLED DETAIL ROW GRID SPECIFICATIONS TABLE */}
                              <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-2.5 text-xs text-slate-700">
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Mã sản phẩm</span>
                                  <span className="text-slate-800 tracking-wider font-mono uppercase">{selectedProduct.code}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Danh mục</span>
                                  <span className="text-slate-800">{selectedProduct.category}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Xuất xứ</span>
                                  <span className="text-slate-800 text-right max-w-[200px] truncate">{selectedProduct.origin}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Ngày sản xuất</span>
                                  <span className="text-slate-800 font-mono font-medium">{selectedProduct.manufactureDate}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Hạn sử dụng</span>
                                  <span className="text-slate-800 font-mono font-medium">{selectedProduct.expiryDate}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Nhà sản xuất</span>
                                  <span className="text-emerald-700 font-bold max-w-[200px] truncate text-right">{selectedProduct.producerName}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-150/60 font-semibold">
                                  <span className="text-slate-450">Địa chỉ</span>
                                  <span className="text-slate-800 text-right max-w-[220px] truncate">{selectedProduct.address}</span>
                                </div>
                                <div className="flex flex-col py-1 space-y-1">
                                  <span className="text-slate-450 font-semibold">Mô tả chi tiết</span>
                                  <p className="text-slate-600 leading-relaxed text-justify mt-0.5 italic">
                                    {selectedProduct.description}
                                  </p>
                                </div>
                              </div>

                              {/* REDIRECT CTA TO TIMELINE */}
                              <button
                                onClick={() => setShowTimeline(true)}
                                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md transition-all text-center flex items-center justify-center space-x-1"
                              >
                                <FileCheck className="w-4.5 h-4.5 mr-1" />
                                <span>XEM QUY TRÌNH SẢN XUẤT</span>
                              </button>

                            </div>
                          ) : (
                            // SCREEN 4: QUY TRÌNH SẢN XUẤT (STEP TIMELINE LOOK)
                            <div className="space-y-4">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  NHẬT KÝ QUY TRÌNH SẢN XUẤT
                                </h4>
                                <button 
                                  onClick={() => setShowTimeline(false)}
                                  className="text-[10px] font-bold text-emerald-600 flex items-center"
                                >
                                  Xem bảng thông số
                                </button>
                              </div>

                              {/* THE GRAPHIC TIMELINE CONNECTOR */}
                              <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-6 py-2 ml-3">
                                {selectedProduct.timeline?.map((step) => (
                                  <div key={step.step} className="relative">
                                    
                                    {/* Circular bullet number indicator */}
                                    <span className="absolute -left-[35px] top-0.5 bg-emerald-600 text-white font-extrabold text-[10px] font-mono w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                      {step.step}
                                    </span>

                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2">
                                      <div className="flex justify-between items-center gap-2">
                                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                          {step.title}
                                        </h5>
                                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] px-1.5 py-0.5 rounded font-black max-h-5 flex items-center leading-none">
                                          {step.date}
                                        </span>
                                      </div>
                                      
                                      <p className="text-[11px] text-slate-550 line-clamp-3 text-justify leading-relaxed">
                                        {step.description}
                                      </p>

                                      <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-24 object-cover rounded-xl mt-1 border border-slate-200"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* big bottom certified seal trigger */}
                              <button
                                onClick={() => setShowCertificate(true)}
                                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center space-x-1.5"
                              >
                                <Award className="w-4.5 h-4.5 text-amber-400" />
                                <span>XEM CHỨNG NHẬN OCOP</span>
                              </button>

                            </div>
                          )}

                        </div>
                      ) : (
                        // SCREEN 2: SẢN PHẨM (CATALOG LIST VIEW)
                        <>
                          <div className="text-center pb-1">
                            <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                              SẢN PHẨM & OCOP
                            </h2>
                          </div>

                          {/* SEARCH INPUT BAR */}
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Tìm kiếm sản phẩm..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 placeholder:text-slate-400 text-slate-800 font-medium"
                            />
                            {searchQuery && (
                              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3.5">
                                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                              </button>
                            )}
                          </div>

                          {/* HORIZONTAL CATEGORY SCROLL PILLS */}
                          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 shrink-0">
                            {["all", "Nông sản", "Cà phê", "Đặc sản", "OCOP"].map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                                  selectedCategory === cat 
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                }`}
                              >
                                {cat === "all" ? "Tất cả" : cat}
                              </button>
                            ))}
                          </div>

                          {/* PRODUCTS ROW STACK LISTING */}
                          <div className="space-y-3.5 overflow-y-auto flex-grow max-h-[480px] pr-1">
                            {getFilteredProducts().length > 0 ? (
                              getFilteredProducts().map(p => (
                                <div
                                  key={p.id}
                                  onClick={() => setSelectedProduct(p)}
                                  className="bg-white p-3 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md cursor-pointer transition-all flex gap-3.5 relative group"
                                >
                                  {/* Thumbnail frame */}
                                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-150 shrink-0 relative">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 bg-slate-900/70 backdrop-blur-sm text-[8px] font-mono text-white px-1 rounded-sm font-bold">
                                      {p.code}
                                    </span>
                                  </div>

                                  {/* Info pane */}
                                  <div className="flex-grow min-w-0 pr-6 flex flex-col justify-between py-0.5">
                                    <div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide leading-none">
                                          {p.category}
                                        </span>
                                      </div>
                                      <h4 className="text-xs font-bold text-slate-850 mt-1 truncate leading-none group-hover:text-emerald-600 transition-colors">
                                        {p.name}
                                      </h4>
                                      <p className="text-[10px] text-slate-400 mt-1 flex items-center leading-none">
                                        <MapPin className="w-2.5 h-2.5 mr-0.5 text-slate-300" />
                                        <span className="truncate">{p.origin.split(",")[0]}</span>
                                      </p>
                                    </div>

                                    {/* Stars review row */}
                                    <div className="flex items-center space-x-1 pt-1 border-t border-slate-50 mt-1">
                                      <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                        ))}
                                      </div>
                                      <span className="text-[9px] text-slate-400 font-semibold leading-none pt-0.5">
                                        ({p.ratingCount})
                                      </span>
                                    </div>
                                  </div>

                                  {/* Favoriting absolutely positioned top-right edge */}
                                  <button
                                    onClick={(e) => handleToggleFavorite(p.id, e)}
                                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-350 hover:text-red-500 transition-colors"
                                  >
                                    <Heart className={`w-4 h-4 ${favorites.includes(p.id) ? "fill-red-500 text-red-500" : ""}`} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-xs text-slate-400">
                                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                Không tìm thấy nông sản tương quan
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: REGION MAP SCREEN (BẢN ĐỒ VÙNG SẢN XUẤT) */}
                  {activeTab === "map" && (
                    <motion.div
                      key="tab-map"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-150">
                        <h2 className="text-xs text-slate-500 font-bold uppercase tracking-widest pl-2">
                          SƠ ĐỒ VÙNG SẢN XUẤT ĐIỆN BIÊN
                        </h2>
                        {/* Interactive View Controller Toggles */}
                        <div className="flex bg-slate-200/60 p-0.5 rounded-xl text-[10px] font-bold">
                          <button
                            onClick={() => setMapViewMode("vector")}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              mapViewMode === "vector"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            🗺️ Sơ đồ
                          </button>
                          <button
                            onClick={() => setMapViewMode("satellite")}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                              mapViewMode === "satellite"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            🛰️ Vệ tinh
                          </button>
                        </div>
                      </div>

                      {/* CONDITIONAL MAP VIEWS */}
                      {mapViewMode === "satellite" ? (
                        hasValidMapsKey ? (
                          <div className="bg-slate-100 border border-slate-200 rounded-3xl h-80 relative overflow-hidden shadow-inner">
                            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
                              <Map
                                defaultCenter={{ lat: 21.3853, lng: 103.0163 }}
                                center={activeRegion ? { lat: activeRegion.gps.lat, lng: activeRegion.gps.lng } : undefined}
                                defaultZoom={9}
                                zoom={activeRegion ? 12 : 9}
                                mapTypeId="hybrid"
                                mapId="DEMO_MAP_ID"
                                gestureHandling="cooperative"
                                disableDefaultUI={false}
                                zoomControl={true}
                                mapTypeControl={false}
                                scaleControl={true}
                                streetViewControl={false}
                                rotateControl={true}
                                fullscreenControl={false}
                                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                                style={{ width: '100%', height: '100%' }}
                              >
                                {MAP_REGIONS.map(reg => {
                                  const isCurrentlyActive = activeRegion?.id === reg.id;
                                  return (
                                    <AdvancedMarker
                                      key={reg.id}
                                      position={{ lat: reg.gps.lat, lng: reg.gps.lng }}
                                      onClick={() => setActiveRegion(reg)}
                                    >
                                      <div className="relative flex flex-col items-center cursor-pointer transition-all transform hover:scale-110" style={{ width: '120px', height: '40px' }}>
                                        {/* Label Tag Container */}
                                        <div 
                                          className={`px-2 py-1 rounded-lg text-[9px] font-extrabold text-white shadow-lg border flex items-center gap-0.5 whitespace-nowrap`}
                                          style={{ 
                                            backgroundColor: reg.color, 
                                            borderColor: isCurrentlyActive ? '#ffffff' : 'transparent', 
                                            borderWidth: isCurrentlyActive ? '2px' : '1px' 
                                          }}
                                        >
                                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                                          <span>{reg.mainProduct}</span>
                                        </div>
                                        {/* Pin Tail */}
                                        <div className="w-2 h-2 rotate-45 -mt-1 shadow-sm" style={{ backgroundColor: reg.color }} />
                                        {/* Ping Echo */}
                                        {isCurrentlyActive && (
                                          <span className="absolute -bottom-1 w-2.5 h-2.5 bg-white border border-emerald-500 rounded-full animate-ping pointer-events-none" />
                                        )}
                                      </div>
                                    </AdvancedMarker>
                                  );
                                })}
                              </Map>
                            </APIProvider>
                            <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-[8px] font-mono text-slate-300 px-2 py-0.5 rounded-md pointer-events-none select-none border border-slate-750">
                              Chế độ: Google Hybrid Satellite
                            </span>
                          </div>
                        ) : (
                          /* GOOGLE MAPS API KEY SETUP SCREEN */
                          <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-5 min-h-[340px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />
                            <div className="space-y-3 relative z-10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-emerald-400">
                                  <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest">KÍCH HOẠT GOOGLE MAPS VỆ TINH</span>
                                </div>
                                <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[8px] font-mono px-2 py-0.5 rounded-lg">
                                  amazing-hub-499416-p5
                                </span>
                              </div>
                              <h3 className="text-xs font-black text-slate-100">Bản Đồ Địa Hình & Thảm Thực Vật Thực Tế</h3>
                              <p className="text-[10px] text-slate-300 leading-relaxed text-left">
                                Bản đồ lai vệ tinh (Satellite Hybrid) cho phép tra cứu tọa độ, độ cao, thảm thực vật vùng cao Điện Biên. Hãy kích hoạt nhanh cho dự án Google Cloud của bạn:
                              </p>

                              {/* Target custom project display banner */}
                              <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40 text-[9px] text-emerald-100 flex items-center justify-between">
                                <div>
                                  <p className="font-extrabold text-white text-[8px] uppercase tracking-wider">Thông tin dự án GCP</p>
                                  <p className="text-emerald-300">ID: amazing-hub-499416-p5</p>
                                  <p className="text-emerald-400 font-mono text-[8px]">Mã số: 1097520453714</p>
                                </div>
                                <a 
                                  href="https://console.cloud.google.com/google/maps-apis/api-list?project=amazing-hub-499416-p5"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded-lg text-[8px] transition-all shrink-0 shadow"
                                >
                                  Mở console ↗
                                </a>
                              </div>

                              {/* Manual Setup Guide Box */}
                              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[9px] space-y-2 text-left">
                                <p className="font-bold text-emerald-350 flex items-center gap-1">
                                  <Info className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> Hướng dẫn tích hợp siêu tốc:
                                </p>
                                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
                                  <li>
                                    <a 
                                      href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=amazing-hub-499416-p5" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-emerald-400 underline hover:text-emerald-350"
                                    >
                                      Kích hoạt Maps JavaScript API tại đây
                                    </a>.
                                  </li>
                                  <li>
                                    <a 
                                      href="https://console.cloud.google.com/google/maps-apis/credentials?project=amazing-hub-499416-p5" 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-emerald-400 underline hover:text-emerald-350"
                                    >
                                      Truy cập Credentials &amp; tạo API Key mới
                                    </a>.
                                  </li>
                                  <li>
                                    Bấm biểu tượng bánh răng <strong className="text-slate-200">Settings (⚙️)</strong> ở góc trên bên phải trang web này → chọn <strong className="text-slate-200">Secrets</strong> → thêm <code className="bg-slate-950 text-yellow-300 font-mono px-1 py-0.5 rounded border border-slate-800">GOOGLE_MAPS_PLATFORM_KEY</code> dán khoá vừa tạo.
                                  </li>
                                </ol>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-900 text-[9px] text-slate-400 flex justify-between items-center relative z-10 gap-2">
                              <span>Hệ thống tự động kích hoạt ngay sau khi dán key.</span>
                              <button 
                                onClick={() => setMapViewMode("vector")}
                                className="px-2.5 py-1 bg-white text-slate-900 font-extrabold rounded-lg hover:bg-slate-100 transition-all text-[8px] shrink-0"
                              >
                                Xem Sơ Đồ Giả Lập
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        /* VECTOR EXPERIMENTAL TOPOGRAPHICAL DISTRICT MAP VIEWPORT */
                        <div className="bg-emerald-900/5 border border-slate-200 rounded-3xl h-80 relative overflow-hidden select-none">
                          
                          {/* simulated rivers underlay */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Nậm rốm and local rivers path */}
                            <path d="M10 20 Q 30 50, 42 55 T 80 90" fill="none" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M5 40 Q 35 45, 65 38" fill="none" stroke="#bfdbfe" strokeWidth="1.2" strokeDasharray="2,2" />
                            <path d="M40 5 Q 52 32, 65 38" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="1,1" strokeLinecap="round" />
                          </svg>

                          {/* Topographical contours */}
                          <div className="absolute top-10 left-5 w-24 h-16 border border-emerald-950/5 rounded-full bg-emerald-950/[0.02] filter blur-[1px] pointer-events-none" />
                          <div className="absolute top-32 left-12 w-32 h-20 border border-emerald-950/5 rounded-full bg-emerald-950/[0.02] filter blur-[1px] pointer-events-none" />
                          <div className="absolute top-12 right-6 w-36 h-28 border border-emerald-950/5 rounded-full bg-emerald-950/[0.02] filter blur-[1px] pointer-events-none" />
                          <div className="absolute bottom-10 right-10 w-40 h-24 border border-emerald-950/5 rounded-full bg-emerald-950/[0.01] filter blur-[1px] pointer-events-none" />

                          {/* Dynamic Pins */}
                          {MAP_REGIONS.map(reg => {
                            const isCurrentlyActive = activeRegion?.id === reg.id;
                            return (
                              <button
                                key={reg.id}
                                onClick={() => {
                                  setActiveRegion(reg);
                                }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all"
                                style={{ left: `${reg.coordinates.x}%`, top: `${reg.coordinates.y}%` }}
                              >
                                {/* active radar ring */}
                                {isCurrentlyActive && (
                                  <span className="absolute -inset-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full animate-ping pointer-events-none" />
                                )}
                                
                                <div className={`p-1.5 rounded-full shadow-lg border-2 border-white transition-all transform hover:scale-115 flex items-center justify-center`}
                                     style={{ backgroundColor: reg.color }}>
                                  <MapPin className="w-3 h-3 text-white" />
                                </div>

                                {/* Label node popup */}
                                <span className={`absolute left-1/2 -translate-x-1/2 top-5 px-1.5 py-0.5 rounded leading-none whitespace-nowrap shadow border pointer-events-none transition-all text-[8px] font-black ${
                                  isCurrentlyActive ? "bg-emerald-800 text-white border-white border text-[8px]" : "bg-slate-900/85 backdrop-blur-sm text-white border-slate-705 group-hover:bg-slate-800"
                                }`}>
                                  {reg.mainProduct}
                                </span>
                              </button>
                            );
                          })}

                          {/* Zoom button overlays */}
                          <div className="absolute bottom-3 right-3 flex flex-col space-y-1">
                            <button className="w-6 h-6 bg-white active:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold text-xs shadow-md cursor-pointer">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button className="w-6 h-6 bg-white active:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold text-xs shadow-md cursor-pointer">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* DETAILED ACTIVE REGION SPECS BLOCK CARD */}
                      <AnimatePresence mode="wait">
                        {activeRegion && (
                          <motion.div
                            key={activeRegion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-slate-50 p-4 border border-slate-150 rounded-2xl space-y-3 shadow-inner"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">
                                  {activeRegion.type}
                                </span>
                                <h3 className="text-xs font-bold text-slate-850 mt-1 leading-tight">
                                  {activeRegion.name}
                                </h3>
                              </div>
                              <span className="bg-slate-200 text-slate-705 font-mono text-[9px] font-bold px-2 py-0.5 rounded leading-none">
                                {activeRegion.area} ha
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-550 leading-relaxed text-justify mt-1">
                              {activeRegion.description}
                            </p>

                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60 text-xs">
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Sản phẩm chính:
                              </span>
                              {PRODUCTS.filter(p => p.name === activeRegion.mainProduct).map(foundProduct => (
                                <button
                                  key={foundProduct.id}
                                  onClick={() => {
                                    setSelectedProduct(foundProduct);
                                    setShowTimeline(false);
                                    setActiveTab("products");
                                  }}
                                  className="text-[11px] text-emerald-700 font-black flex items-center hover:underline"
                                >
                                  <span>Xem {foundProduct.name}</span>
                                  <ArrowRight className="w-3 h-3 ml-0.5" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-[10px] text-slate-500">
                        <div className="flex items-start">
                          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 mr-1.5" />
                          <p className="leading-relaxed">
                            Bản đồ cho phép định vị trực quan các hợp tác xã được công nhận. Bấm vào các dấu mốc màu trên sơ đồ gồ ghề để tra soát đặc khu nuôi trồng VietGAP.
                          </p>
                        </div>
                      </div>

                    </motion.div>
                  )}



                  {/* TAB 4: COOPERATIVES SCREEN (NHÀ SẢN XUẤT) */}
                  {activeTab === "producers" && (
                    <motion.div
                      key="tab-producers"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      <div className="text-center">
                        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                          HỢP TÁC XÃ nòng cốt
                        </h2>
                      </div>

                      {/* SUB-VIEW FOR PRODUCER CHOSEN */}
                      {selectedProducer ? (
                        <div className="space-y-4">
                          <button
                            onClick={() => setSelectedProducer(null)}
                            className="flex items-center space-x-1 text-xs font-bold text-slate-650"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Quay lại</span>
                          </button>

                          <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={selectedProducer.image} alt={selectedProducer.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-850">
                              {selectedProducer.name}
                            </h3>
                            <p className="text-xs text-slate-400 flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-300 shrink-0" />
                              <span>{selectedProducer.address}</span>
                            </p>
                          </div>

                          {/* spec properties */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs space-y-2.5">
                            <div className="flex justify-between items-center border-b border-slate-200/65 pb-1.5">
                              <span className="text-slate-450 font-semibold">Điện thoại liên hệ</span>
                              <span className="font-mono text-slate-800 font-bold">{selectedProducer.phone}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200/65 pb-1.5">
                              <span className="text-slate-450 font-semibold">Hòm thư điện tử</span>
                              <span className="font-mono text-slate-800">{selectedProducer.email}</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-slate-450 font-semibold">Dòng nông sản đăng kiểm</span>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {selectedProducer.products.map(p => (
                                  <span key={p} className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded px-2 py-0.5 text-[9px] font-bold">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Related catalogue for this HTX */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                              Sản phẩm kinh doanh
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {PRODUCTS.filter(p => p.producerId === selectedProducer.id).map(prod => (
                                <div
                                  key={prod.id}
                                  onClick={() => {
                                    setSelectedProduct(prod);
                                    setShowTimeline(false);
                                    setActiveTab("products");
                                  }}
                                  className="bg-white p-2.5 border border-slate-150 rounded-xl cursor-pointer hover:border-emerald-600 hover:shadow-sm"
                                >
                                  <img src={prod.image} alt={prod.name} className="w-full h-16 object-cover rounded-lg" />
                                  <h5 className="text-[11px] font-bold text-slate-800 mt-1.5 truncate leading-none">
                                    {prod.name}
                                  </h5>
                                  <span className="text-[9px] font-mono text-slate-400 mt-0.5 inline-block">
                                    {prod.code}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        // GENERAL LIST OF COOPERATIVES
                        <>
                          {/* SEARCH INPUT BAR */}
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Tìm kiếm nhà sản xuất..."
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 placeholder:text-slate-400 text-slate-850 font-semibold"
                            />
                          </div>

                          <div className="space-y-3.5 overflow-y-auto max-h-[460px] pr-1">
                            {PRODUCERS.map(prod => (
                              <div
                                key={prod.id}
                                onClick={() => setSelectedProducer(prod)}
                                className="bg-white p-3 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md cursor-pointer transition-all flex gap-3.5 relative group"
                              >
                                <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                
                                <div className="min-w-0 flex-grow py-0.5 flex flex-col justify-between">
                                  <div>
                                    <h3 className="text-xs font-bold text-slate-850 group-hover:text-emerald-600 truncate transition-all leading-tight">
                                      {prod.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center leading-none">
                                      <MapPin className="w-3 h-3 mr-0.5 text-slate-350 shrink-0" />
                                      <span className="truncate">{prod.address.split(",")[0]}</span>
                                    </p>
                                  </div>

                                  <div className="flex justify-between items-center pt-1 mt-1 border-t border-slate-100">
                                    <span className="text-[9px] text-slate-400 font-medium">
                                      {prod.products.length} sản phẩm
                                    </span>
                                    
                                    <div className="flex items-center text-amber-500">
                                      <Star className="w-2.5 h-2.5 fill-current" />
                                      <span className="text-[10px] font-bold text-slate-500 pl-0.5 leading-none">
                                        {prod.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 5: FAVORITES DECK (YÊU THÍCH) */}
                  {activeTab === "favorites" && (
                    <motion.div
                      key="tab-favorites"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      <div className="text-center">
                        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                          NÔNG SẢN UY TÍN YÊU THÍCH
                        </h2>
                      </div>

                      <div className="space-y-3.5 overflow-y-auto max-h-[480px]">
                        {favorites.length > 0 ? (
                          PRODUCTS.filter(p => favorites.includes(p.id)).map(p => (
                            <div
                              key={p.id}
                              onClick={() => setSelectedProduct(p)}
                              className="bg-white p-3 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md cursor-pointer transition-all flex gap-3.5 relative"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-150 shrink-0 relative">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              </div>

                              <div className="flex-grow min-w-0 pr-6 flex flex-col justify-between py-0.5">
                                <div>
                                  <span className="text-[9.5px] font-bold text-emerald-600 uppercase tracking-wider leading-none">
                                    {p.category}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-850 mt-1 truncate leading-none">
                                    {p.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 flex items-center mt-1 leading-none">
                                    <MapPin className="w-3 h-3 mr-0.5 text-slate-350" />
                                    <span className="truncate">{p.origin.split(",")[0]}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Favoriting absolutely positioned top-right edge */}
                              <button
                                onClick={(e) => handleToggleFavorite(p.id, e)}
                                className="absolute top-2.5 right-2 text-red-500 hover:text-slate-350 p-1"
                              >
                                <Heart className="w-4 h-4 fill-current" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs">
                            <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            Chưa lưu nông sản yêu thích nào
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 6: LEDGER TRANSACTIONS HISTORY SCREEN (LỊCH SỬ QUÉT) */}
                  {activeTab === "history" && (
                    <motion.div
                      key="tab-history"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                          LỊCH SỬ TRUY XUẤT Block
                        </h2>
                        {scansHistory.length > 0 && (
                          <button
                            onClick={handleClearHistory}
                            className="bg-red-50 hover:bg-red-100 text-[10px] text-red-600 px-2 py-1 rounded font-bold transition-all"
                          >
                            Xóa hết
                          </button>
                        )}
                      </div>

                      <div className="space-y-3.5 overflow-y-auto max-h-[460px] pr-1">
                        {scansHistory.length > 0 ? (
                          scansHistory.map(item => (
                            <div
                              key={item.id}
                              onClick={() => {
                                const prod = PRODUCTS.find(p => p.code === item.code);
                                if (prod) {
                                  setSelectedProduct(prod);
                                  setShowTimeline(true);
                                  setActiveTab("products");
                                }
                              }}
                              className="bg-slate-50/70 hover:bg-slate-50 p-3 rounded-2xl border border-slate-150 cursor-pointer transition-all space-y-2"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                  {item.code}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-150/50">
                                <div className="flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-350" />
                                  <span>{item.time}</span>
                                </div>
                                <span className="text-slate-400 font-mono text-[9px] truncate max-w-[120px]">
                                  Hash Code: {item.hash}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs">
                            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            Màn lịch sử trống. Hãy quét thử QR nhãn để trải nghiệm!
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 7: CÀI ĐẶT & HỖ TRỢ SCREEN (CÀI ĐẶT) */}
                  {activeTab === "settings" && (
                    <motion.div
                      key="tab-settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      <div className="text-center">
                        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                          HỆ THỐNG CÀI ĐẶT
                        </h2>
                      </div>

                      {/* settings rows */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-4 text-xs">
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-slate-800">Thông báo từ hợp tác xã</h4>
                            <p className="text-[10px] text-slate-400">VietGAP thay đổi vụ bắp đậu, chè dọn sấy</p>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-emerald-600 cursor-pointer w-4 h-4" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-slate-800">Sử dụng dữ liệu mạng di động</h4>
                            <p className="text-[10px] text-slate-400">Tắt để chỉ dùng Wifi lướt bản đồ vùng trồng</p>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-emerald-600 cursor-pointer w-4 h-4" />
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 pb-1">
                          <h4 className="font-bold text-slate-800">Ngôn ngữ hiển thị</h4>
                          <span className="font-extrabold text-emerald-800 font-display">Tiếng Việt (VN)</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-1.5 text-xs text-center text-slate-500">
                        <Award className="w-5 h-5 text-amber-500 mx-auto mb-1 animate-spin" style={{ animationDuration: "12s" }} />
                        <h4 className="font-bold text-slate-800 text-[11px]">ĐIỆN BIÊN AGRI PLATFORM</h4>
                        <p className="text-[10px]">Cơ quan chủ trì: Sở Nông Nghiệp & PTNT Tỉnh Điện Biên</p>
                        <p className="text-[9px] font-mono">Phiên bản thiết kế di động 2026.4b2</p>
                      </div>

                      {/* CONTACT SUBMISSION FORM */}
                      <div id="contact-section" className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-3">
                        <div className="flex items-center space-x-1.5 border-b pb-1.5 border-slate-250">
                          <Phone className="w-4 h-4 text-emerald-700" />
                          <h4 className="font-bold text-slate-800 text-xs">Liên Hệ Tư Vấn & Góp Ý</h4>
                        </div>
                        
                        <form onSubmit={handleSubmitContact} className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Họ và tên..."
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 w-full text-slate-800"
                            />
                            <input
                              type="tel"
                              placeholder="Số điện thoại..."
                              required
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 w-full text-slate-800"
                            />
                          </div>
                          
                          <textarea
                            placeholder="Nhập nội dung cần hỗ trợ hoặc đăng ký tham gia chuỗi..."
                            rows={2}
                            value={contactForm.text}
                            onChange={(e) => setContactForm({...contactForm, text: e.target.value})}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 w-full text-slate-800 resize-none"
                          />
                          
                          <button
                            type="submit"
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider text-center"
                          >
                            Gửi yêu cầu đóng góp htx
                          </button>
                        </form>
                      </div>

                    </motion.div>
                  )}

                  {/* TAB 8: GUIDES & HANDBOOK SCREEN (CẨM NANG & HƯỚNG DẪN) */}
                  {activeTab === "guides" && (
                    <motion.div
                      key="tab-guides"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col flex-grow bg-white p-4 space-y-4"
                    >
                      {selectedNews ? (
                        <div className="space-y-4">
                          <button
                            onClick={() => setSelectedNews(null)}
                            className="flex items-center space-x-1 text-xs font-bold text-slate-650"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Quay lại</span>
                          </button>

                          <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                              {selectedNews.title}
                            </h3>
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>Tác giả: {selectedNews.author}</span>
                              <span>Ngày: {selectedNews.date}</span>
                            </div>
                          </div>

                          <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-36 object-cover rounded-xl" />

                          <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line text-slate-900 font-semibold italic border-l-2 border-emerald-500 pl-3">
                            {selectedNews.summary}
                          </p>

                          <p className="text-xs text-slate-550 leading-relaxed text-justify whitespace-pre-line">
                            {selectedNews.content}
                          </p>

                        </div>
                      ) : (
                        <>
                          <div className="text-center">
                            <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                              CẨM NANG & KIẾN THỨC
                            </h2>
                          </div>

                          <div className="space-y-4 overflow-y-auto max-h-[480px]">
                            {/* News cards segment */}
                            <div className="space-y-2">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                Tin Tức Xuất Bản
                              </h3>
                              {NEWS.map(n => (
                                <div
                                  key={n.id}
                                  onClick={() => setSelectedNews(n)}
                                  className="bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl border border-slate-150 flex gap-3 cursor-pointer transition-all"
                                >
                                  <img src={n.image} alt="newspic" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                                  <div className="min-w-0 flex flex-col justify-between py-0.5">
                                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                      {n.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                      {n.summary}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Handbook section */}
                            <div className="space-y-2.5 pt-2 border-t border-slate-100">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                Sổ Tay Hướng Dẫn Kỹ Thuật
                              </h3>
                              
                              {GUIDES.map(g => (
                                <div key={g.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                      {g.category}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                    {g.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 text-justify leading-relaxed">
                                    {g.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* NATIVE APP BOTTOM NAVIGATION BAR COMPONENT (Exactly matching tabs) */}
              <div className="h-16 bg-white border-t border-slate-150 px-3 flex justify-around items-center select-none z-40 shrink-0">
                {[
                  { id: "home", label: "Trang chủ", icon: Home },
                  { id: "favorites", label: "Yêu thích", icon: Heart },
                  { id: "history", label: "Lịch sử", icon: Clock },
                  { id: "settings", label: "Cài đặt", icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id || 
                    (tab.id === "home" && ["map", "producers", "guides"].includes(activeTab) && !selectedProduct && !selectedProducer);
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedProduct(null);
                        setSelectedProducer(null);
                        setSelectedNews(null);
                        setShowTimeline(false);
                        setShowCertificate(false);
                      }}
                      className="flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95 text-center"
                    >
                      <Icon className={`w-5.5 h-5.5 transition-colors ${
                        isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                      }`} />
                      <span className={`text-[10px] font-bold mt-1 leading-none tracking-tight ${
                        isSelected ? "text-emerald-600" : "text-slate-405 text-slate-500"
                      }`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* simulated iOS Home Slide Bar indicator overlay */}
              {deviceType === "ios" && (
                <div className="h-5 bg-white flex justify-center pb-2 z-40 shrink-0 select-none">
                  <div className="w-28 h-1 bg-slate-400/50 rounded-full" />
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* DETAILED HIGH-FIDELITY ACTIVE CERTIFICATE MODAL SCREEN OVERLAY (XEM CHỨNG NHẬN) */}
      <AnimatePresence>
        {showCertificate && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-slate-805 rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1.5">
                <Award className="w-12 h-12 text-amber-500 mx-auto fill-amber-100" />
                <h3 className="text-base font-black font-display uppercase tracking-wide text-slate-900 leading-tight">
                  Chuyên Thư Chứng Thực OCOP
                </h3>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
                  dien bien agri certified stamp
                </p>
              </div>

              {/* Graphic visual representing paper certificate seal */}
              <div className="border border-amber-300 bg-amber-50/50 p-5 rounded-2xl relative overflow-hidden text-center space-y-3 shadow-inner">
                {/* diagonal watermarks */}
                <div className="absolute inset-0 select-none opacity-[0.03] text-slate-950 flex flex-wrap gap-4 text-[10px] items-center rotate-12 uppercase font-black tracking-normal">
                  {Array.from({length: 40}, () => "DIEN BIEN AGRI CERTIFIED")}
                </div>

                <div className="space-y-1 relative z-10">
                  <div className="inline-block px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-1">
                    Đạt Chuẩn {selectedProduct.ocopStar} Sao OCOP
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight uppercase">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Chứng nhận số: OCOP-DB-{selectedProduct.code}-2026
                  </p>
                </div>

                <div className="py-2.5 border-t border-b border-amber-200/50 text-[11px] text-slate-650 leading-relaxed text-justify space-y-1">
                  <p>🔹 <strong>Phán quyết kiểm định:</strong> Sản phẩm do <strong>{selectedProduct.producerName}</strong> chịu trách nhiệm phân hạt dọn sạch đất, áp dụng quy trình VietGAP an toàn sinh học.</p>
                  <p>🔹 <strong>Chữ ký số:</strong> Ban chỉ đạo Chương trình Mỗi xã một sản phẩm (OCOP) Tỉnh Điện Biên bảo hộ lưu hành.</p>
                </div>

                {/* Simulated Stamp Graphics image overlay */}
                <div className="flex justify-between items-center pt-1.5 relative z-10 text-[10px]">
                  <div className="text-left font-semibold text-slate-500">
                    <p>Ngày ký: 15/01/2026</p>
                    <p className="text-[9px] text-slate-400">Có hiệu lực đến: 2029</p>
                  </div>
                  {/* Circular Gold Seal graphic stamp */}
                  <div className="w-14 h-14 rounded-full border-4 border-double border-red-500/80 flex items-center justify-center text-center p-1 font-black text-red-500/80 uppercase text-[6px] tracking-tight shrink-0 rotate-12">
                    Ban chỉ đạo OCOP ĐB
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md text-center"
              >
                Xác nhận đã xem
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WEB DESKTOP FOOTER BAR (Hidden if active device type is fullscreen on real mobile) */}
      {deviceType !== "fullscreen" && (
        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center sm:text-left mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 Mạng lưới Nông sản OCOP Điện Biên Agri. Tất cả quyền được bảo lưu.</p>
            <p>Hệ thống Chuỗi liên kết Blockchain Nông Sản Việt Nam • Thiết kế Mobile-First</p>
          </div>
        </footer>
      )}

    </div>
  );
}

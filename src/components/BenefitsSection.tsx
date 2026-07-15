import { Users, Camera, Shield, Home, Utensils, Flame } from "lucide-react";
import poolImage from "@/assets/IMG-20251001-WA0005.jpg";
import bbqImage from "@/assets/bbq-area.jpg";
import bedroomImage from "@/assets/bedroom-aesthetic.jpg";

const benefits = [
  {
    icon: Users,
    title: "Momen Kebersamaan yang Tak Terlupakan",
    description:
      "Baik itu tawa lepas keluarga atau cerita hangat bersama sahabat, D'VILLAMODA menyediakan ruang privat yang luas untuk Anda terkoneksi tanpa gangguan. Ciptakan kenangan yang akan selalu Anda kenang.",
    image: poolImage,
    features: [
      {
        icon: Home,
        text: "Ruang Keluarga Terbuka & Nyaman: Sofa empuk, Smart TV dengan Netflix, dan sistem audio Bluetooth.",
      },
      {
        icon: Utensils,
        text: "Dapur Lengkap & Modern: Peralatan masak premium, kulkas besar, microwave, dan dispenser air.",
      },
      {
        icon: Flame,
        text: "Area BBQ Outdoor: Perlengkapan BBQ lengkap dan area makan outdoor yang luas.",
      },
    ],
  },
  {
    icon: Camera,
    title: "Estetika Instagrammable di Setiap Sudut",
    description:
      "D'VILLAMODA bukan hanya tempat menginap, tapi juga latar sempurna untuk konten media sosial Anda. Desain Modern Scandinavian kami yang minimalis dan hangat akan membuat setiap foto dan video Anda terlihat profesional dan memukau.",
    image: bedroomImage,
    features: [
      {
        icon: Home,
        text: "Desain Interior Scandinavian Otentik: Perpaduan kayu alami, warna lembut, dan pencahayaan hangat.",
      },
      {
        icon: Camera,
        text: "Kolam Renang Pribadi Estetik: Berenang santai atau abadikan momen floating breakfast Anda.",
      },
      {
        icon: Home,
        text: "Teras & Taman Asri: Pemandangan hijau yang menenangkan, spot ideal untuk bersantai atau berfoto.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Ketenangan Pikiran, Liburan Bebas Khawatir",
    description:
      "Kami memahami kekhawatiran Anda. D'VILLAMODA berkomitmen untuk memberikan pengalaman yang transparan, aman, dan tanpa kejutan. Fokuslah pada relaksasi, biarkan kami mengurus sisanya.",
    image: bbqImage,
    features: [
      {
        icon: Shield,
        text: "Proses Pemesanan Langsung yang Aman: Tanpa perantara, interaksi langsung dengan tim profesional kami.",
      },
      {
        icon: Home,
        text: "Kebersihan Standar Hotel Bintang 5: Villa selalu dibersihkan menyeluruh sebelum dan sesudah kunjungan.",
      },
      {
        icon: Shield,
        text: "Pemandangan Alam yang sangat indah dengan view rooftop terhadap gunung.",
      },
    ],
  },
];

export const BenefitsSection = () => {
  return (
    <section
      id="benefits-section"
      style={{ scrollMarginTop: "5rem" }}
      className="py-20 md:py-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Lebih dari Sekadar Villa, Ini Adalah Pengalaman yang Anda Dambakan.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Setiap sudut D'VILLAMODA adalah undangan untuk merasakan:
            kehangatan, kenyamanan, dan kebersamaan yang mendalam, dirancang
            khusus untuk Anda.
          </p>
        </div>

        <div className="space-y-24">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-3 bg-primary/10 rounded-xl px-4 py-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-primary">
                      Fasilitas
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold">
                    {benefit.title}
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="space-y-4 pt-4">
                    <h4 className="font-semibold text-lg">
                      Fasilitas Tersedia:
                    </h4>
                    {benefit.features.map((feature, fIndex) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={fIndex}
                          className="flex gap-3 items-start bg-secondary/50 rounded-xl p-4"
                        >
                          <FeatureIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <p className="text-sm md:text-base">{feature.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

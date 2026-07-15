import { AlertCircle, CheckCircle, Heart } from "lucide-react";

export const TransformationSection = () => {
  return (
    <section
      id="transformation-section"
      style={{ scrollMarginTop: "5rem" }}
      className="py-20 md:py-32 bg-gradient-to-b from-card to-secondary/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            Lupakan Rutinitas, Sambut Kenangan Baru.
          </h2>
          <p className="text-lg md:text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Anda lelah dengan hiruk pikuk kota? Bosan dengan liburan yang
            itu-itu saja, atau justru takut tertipu saat mencari villa online?
            Kami mengerti. Liburan seharusnya menjadi pelarian yang bermakna,
            bukan sumber stres baru.
          </p>

          {/* Problem → Agitation → Solution Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-destructive/20">
              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-4">Masalah Anda</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    <strong>Terjebak Rutinitas:</strong> Hari-hari terasa
                    monoton, butuh jeda yang nyata.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    <strong>Pilihan Villa Membingungkan:</strong> Sulit
                    menemukan yang sesuai ekspektasi, estetik, dan nyaman.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    <strong>Ancaman Penipuan:</strong> Ketakutan akan villa
                    fiktif atau foto yang tidak sesuai kenyataan.
                  </span>
                </li>
              </ul>
            </div>

            {/* Agitation */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-accent/30">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dampak Masalah</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span>
                    Waktu liburan berharga terbuang karena villa kotor,
                    fasilitas rusak, atau tidak ada sama sekali.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span>
                    Momen kebersamaan yang hangat justru diwarnai kekecewaan dan
                    rasa tidak aman.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span>
                    Konten media sosial hambar, tidak ada yang spesial untuk
                    dibagikan.
                  </span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 shadow-lg border-2 border-primary/30">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">
                Solusi D'VILLAMODA
              </h3>
              <ul className="space-y-3 text-foreground">
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Sanctuary Modern Scandinavian:</strong> Desain
                    menenangkan untuk kenyamanan maksimal.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pengalaman Terkurasi:</strong> Setiap detail sudah
                    kami pikirkan agar Anda bisa fokus menikmati.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Keamanan & Transparansi:</strong> Pemesanan langsung
                    yang jelas dengan jaminan nyata.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

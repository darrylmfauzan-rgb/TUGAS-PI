import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Mrs. Mia Widianti & Family.",
    location: "Jakarta",
    rating: 5,
    text: "Overall Saya puas, tempatnya nyaman, internet kencang, dan past bakal balik lagi kesini sih!",
  },
  {
    name: "Reza & Geng",
    location: "Bandung",
    rating: 5,
    text: "Sangat cocok untuk kumpul-kumpul bareng geng. Fasilitasnya lengkap, Wi-Fi kencang, dan area BBQ-nya juara! Betah banget sampai lupa waktu. Rasanya kayak liburan di luar negeri, tapi dekat dari Jakarta.",
  },
  {
    name: "Keluarga Budi",
    location: "Tangerang",
    rating: 5,
    text: "Villa baru yang bersih dan terawat. Desain Scandinavian-nya bikin nyaman dan tenang. Penjaga villa sangat membantu dan responsif. Pengalaman menginap yang jauh dari ekspektasi positif kami!",
  },
];

export const TestimonialsSection = () => {
  return (
    <section
      id="testimonials-section"
      style={{ scrollMarginTop: "5rem" }}
      className="py-20 md:py-32 bg-gradient-to-b from-secondary/20 to-card"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Apa Kata Customer Kami Tentang D'VILLAMODA?
            </h2>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ratusan keluarga dan teman telah merasakan pengalaman tak terlupakan
            bersama kami.
          </p>

          {/* Rating Badge */}
          <div className="inline-flex items-center gap-3 mt-8 bg-card rounded-full px-6 py-3 shadow-lg border border-primary/20">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="h-6 w-px bg-border" />
            <span className="font-bold text-2xl">4.9/5.0</span>
            <span className="text-muted-foreground">dari 150+ ulasan</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl"
            >
              <CardContent className="p-6 space-y-4">
                <Quote className="w-10 h-10 text-primary/20" />

                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="pt-4 border-t border-border">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah D'VILLAMODA aman dari penipuan online?",
    answer:
      "Ya, kami sangat memahami kekhawatiran Anda. D'VILLAMODA adalah properti nyata dengan lokasi fisik yang jelas di Puncak belakang kantor desa tugu selatan. Kami mendorong pemesanan langsung melalui WhatsApp atau website resmi kami untuk memastikan transparansi dan keamanan transaksi Anda. Anda akan menerima konfirmasi resmi dan dapat berkomunikasi langsung dengan tim kami.",
  },
  {
    question: "Berapa kapasitas maksimal D'VILLAMODA?",
    answer:
      "D'VILLAMODA memiliki 3 kamar tidur dan dapat menampung hingga 15 orang dewasa dengan nyaman. Kami menyediakan tempat tidur tambahan jika diperlukan dengan biaya tambahan.",
  },
  {
    question: "Fasilitas apa saja yang tersedia di villa?",
    answer:
      "Kami menyediakan kolam renang pribadi, Smart TV dengan streaming Netflix, Wi-Fi berkecepatan tinggi, dapur lengkap (kompor, kulkas, microwave, peralatan masak & makan), area BBQ, air panas, dan area parkir yang luas.",
  },
  {
    question: "Apakah kolam renangnya air hangat?",
    answer:
      "Kolam renang kami saat ini menggunakan air biasa yang segar dari pegunungan. Kami terus berinovasi dan akan menginformasikan jika fitur air hangat tersedia di masa mendatang.",
  },
  {
    question:
      "Bagaimana cara menuju lokasi D'VILLAMODA dan apakah dekat dengan tempat wisata?",
    answer:
      "D'VILLAMODA berlokasi di Puncak belakang kantor desa tugu selatan, Kami juga sangat dekat dengan atraksi populer seperti Dairyland Farm Theme Park, Taman Safari Indonesia serta Gunung Mas . Kami akan mengirimkan panduan arah detail sebelum kedatangan Anda.",
  },
  {
    question: "Bagaimana proses pemesanan dan pembayaran?",
    answer:
      "Anda dapat mengecek ketersediaan dan memesan langsung melalui WhatsApp atau website kami. Setelah tanggal dikonfirmasi, Anda akan diminta untuk membayar uang muka (DP 50%) dan pelunasan sisanya saat check-in atau H-3 hari. Kami menyediakan opsi pembayaran yang aman.",
  },
  {
    question: "Apa yang harus saya lakukan jika ada masalah selama menginap?",
    answer:
      "Tim kami selalu siaga untuk membantu Anda. Anda dapat menghubungi penjaga villa kami atau tim admin melalui WhatsApp kapan saja untuk bantuan. Kami berkomitmen untuk memastikan kenyamanan Anda.",
  },
  {
    question:
      "Apakah ada diskon untuk pemesanan di hari kerja (weekdays) atau jangka panjang?",
    answer:
      "Ya, kami seringkali menawarkan harga khusus yang lebih menarik untuk pemesanan di hari kerja atau untuk sewa jangka panjang (mingguan/bulanan). Silakan hubungi kami untuk informasi lebih lanjut mengenai penawaran ini.",
  },
];

export const FAQSection = () => {
  return (
    <section
      id="faq-section"
      style={{ scrollMarginTop: "5rem" }}
      className="py-20 md:py-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Semua yang perlu Anda ketahui tentang D'VILLAMODA
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

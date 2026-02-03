export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-[#F8FAFC] text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight">
        OSSへの貢献、難しそう？
        <br />
        ここなら、3分で完了します。
      </h1>
      <p className="mt-4 text-lg text-[#64748B] max-w-xl mx-auto">
        Git Training Groundは、安全にPRを練習できる場所です。
        <br />
        失敗しても大丈夫。何度でもやり直せます。
      </p>
      <a
        href="/tutorial"
        className="inline-block mt-8 px-8 py-3 bg-[#10B981] text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-colors"
      >
        チュートリアルを見る
      </a>
    </section>
  );
}

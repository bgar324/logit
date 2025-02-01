import RoundedBox from "./components/RoundedBox";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col h-screen justify-center items-center">
      <div className="flex justify-center items-center gap-16 flex-col sm:flex-col md:flex-row">
        <RoundedBox
          route = "/calendar" 
          borderColor="#CA8A04"
          interiorColor="#FEF9C3"
          text="Calendar"
          icon="📅"
        />

        <RoundedBox
          route = "/log" 
          borderColor="#15803D"
          interiorColor="#D1FAE5"
          text="Log your workout"
          icon="🏋️"
        />

        <RoundedBox
          route = "/analyzer" 
          borderColor="#1E3A8A"
          interiorColor="#BFDBFE"
          text="Analyze"
          icon="📈"
        />
      </div>
      <a href="/" className="underline text-gray-500 italic pt-6">Unsure of what to do? Let Ben (me!) figure it out for you.</a>
    </div>
  );
}
import { Intersection } from "@/interfaces/components/traffic-lights/intersection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">Moniteur de Feux Tricolores</h1>
      <Intersection />
    </div>
  );
}

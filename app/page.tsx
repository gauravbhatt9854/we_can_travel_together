import LocationForm from "./(component)/home/helper/LocationForm";
import Header from "./(component)/header/Header";

export default function Home() {
  return (

    <div className="min-h-screen w-full overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto">
        <LocationForm />
      </div>
    </div>

  );
}
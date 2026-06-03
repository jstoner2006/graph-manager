import Image from "next/image";
import "server-only";
export default function Home() {
  console.log("home page project ran");
  return (
    <div>
      <main>
        <div>
          <h1>Home page for a project</h1>
        </div>
      </main>
    </div>
  );
}

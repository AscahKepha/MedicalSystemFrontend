import { NavbarD } from "../components/doctordashboard/NavbarD";
import { FooterD} from "../components/doctordashboard/FooterD";
import { HeroD } from "../components/doctordashboard/HeroD";

export default function AdminDashboard() {
    return (
        <div className="h-screen">
            <NavbarD />
            <HeroD/>
            <FooterD />
        </div>

    );
} 
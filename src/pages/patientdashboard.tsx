import { HeroP } from "../components/patientdashboard/HeroP";
import { NavbarP} from "../components/patientdashboard/NavbarP";
import { FooterP } from "../components/patientdashboard/fotterP";

export default function AdminDashboard() {
    return (
        <div className="h-screen">
            <NavbarP />
            <HeroP/>
            <FooterP />
        </div>

    );
} 
import { useRouter } from "next/router";

const SelectRole = () => {
    const router = useRouter();

    const selectRole = async (role: "Patient" | "Professional") => {
        try {
            const response = await fetch("/api/update-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            if (response.ok) {
                const { role } = await response.json();
                if (role === "Patient") {
                    router.push("/dashboard/patient");
                } else if (role === "Professional") {
                    router.push("/dashboard/professional");
                }
            } else {
                console.error("Error updating role");
            }
        } catch (error) {
            console.error("Error selecting role:", error);
        }
    };

    return (
        <div>
            <h1>Selecciona tu rol</h1>
            <button onClick={() => selectRole("Patient")}>Entrar como Paciente</button>
            <button onClick={() => selectRole("Professional")}>Entrar como Profesional</button>
        </div>
    );
};

export default SelectRole;

const apiUrl = import.meta.env.VITE_API_URL;

const authService = {
    async login(username, password) {
        
        try {
            const response = await fetch(`${apiUrl}/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            
            return {
                token: data.admin.token,
                admin: {
                    id: data.admin._id,
                    username: data.admin.username
                }
            };
        } catch (error) {
            throw new Error(error.message || "An error occurred during login");
        }
    },
};

export default authService;
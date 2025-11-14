document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                window.location.href = '/home';
            } else {
                alert(result.message || 'Error en el login');
            }
        } catch (error) {
            alert('Error al iniciar sesión');
            console.error(error);
        }
    });
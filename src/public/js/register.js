 document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            age: parseInt(formData.get('age')),
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('/api/sessions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Usuario registrado exitosamente');
                window.location.href = '/login';
            } else {
                alert(result.message || 'Error en el registro');
            }
        } catch (error) {
            alert('Error al registrar usuario');
            console.error(error);
        }
    });
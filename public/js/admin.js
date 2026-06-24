

const form = document.getElementById('adminForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const manage=document.getElementById('manageTable');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Basic client-side validation
            if (!username || !password) {
                alert('Please fill in both username and password');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            const data = {
                username: username,
                password: password
            };

            try {
                const response = await fetch('/admin/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Success:', result);
                    alert('Admin created successfully!');
                    
                    // Clear form after success
                    form.reset();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Error: ${errorData.message || 'Failed to create admin'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(' Network error. Please check your connection.');
            }
        });
      
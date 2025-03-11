export default {
     content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
      theme: { extend: {
        animation: {
          'slide-down': 'slide-down 0.3s ease-out',
        },
        keyframes: {
          'slide-down': {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(0)' },
          }
          
        }
        
      }, 
    }, plugins: [], 
};s

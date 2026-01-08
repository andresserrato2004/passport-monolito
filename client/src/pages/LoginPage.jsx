import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Limpiar errores previos
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      console.log("Login exitoso, redirigiendo al passport");
      
      // Disparar evento para que App.jsx detecte el cambio
      window.dispatchEvent(new Event('tokenChanged'));
      
      // Usar navigate después de disparar el evento
      setTimeout(() => {
        navigate("/passport");
      }, 50);
      
    } catch (err) {
      console.error("Error en login:", err);
      
      // Manejar diferentes tipos de errores
      let errorMessage = "Error de conexión. Inténtalo nuevamente.";
      
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || "";
        
        switch (status) {
          case 401:
            // Error de credenciales incorrectas
            if (serverMessage.toLowerCase().includes('password') || 
                serverMessage.toLowerCase().includes('contraseña')) {
              errorMessage = "❌ Contraseña incorrecta. Verifica tu número de carnet.";
            } else if (serverMessage.toLowerCase().includes('user') || 
                       serverMessage.toLowerCase().includes('usuario') ||
                       serverMessage.toLowerCase().includes('email')) {
              errorMessage = "❌ Usuario no encontrado. Verifica tu nombre de usuario.";
            } else {
              errorMessage = "❌ Usuario o contraseña incorrectos. Verifica tus credenciales.";
            }
            break;
          case 403:
            errorMessage = "❌ No tienes autorización para acceder. Contacta al administrador.";
            break;
          case 404:
            errorMessage = "❌ Usuario no encontrado. Verifica tu nombre de usuario.";
            break;
          case 500:
            errorMessage = "❌ Error del servidor. Inténtalo más tarde.";
            break;
          default:
            errorMessage = `❌ Error: ${serverMessage || 'Problema de autenticación'}`;
        }
      } else if (err.request) {
        errorMessage = "❌ No se pudo conectar al servidor. Verifica tu conexión a internet.";
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('https://yt3.googleusercontent.com/-ySlVFY5JqTqV72pNodGR1k7vOIaWH5Usa4-nTd0QN-FmAqjJqQSJlauEYGhrpK9cxTLqLm5Vw=s900-c-k-c0x00ffffff-no-rj')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '900px 900px',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-100/80"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pasaporte Escuela</h1>
          <p className="text-gray-600">Bienvenido Estudiante</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Mensaje de error */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-red-400 text-lg">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: andres.serrato-c"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su carnet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <IoEye className="w-5 h-5" />
                    ) : (
                      <IoEyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer del formulario */}
          <div className="bg-gray-50 px-8 py-4">
            <p className="text-center text-sm text-gray-600">
              🏫 Universidad Escuela Colombiana de Ingeniería Julio Garavito
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Explora la universidad y colecciona estampillas 🎪
          </p>
        </div>
      </div>
    </div>
  );
}

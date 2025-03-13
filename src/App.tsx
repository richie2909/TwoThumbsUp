
import { ReactRouter } from "./routes/ReactRouter"; 
// import NotFound from "./pages/NotFound";
import { AuthProvider } from './Context/AuthContext'; 
import { ImageProvider } from './Context/context.tsx'



function App () {
  return (
   <div className="w-full h-[100vh] from-gray-100 to-gray-200" >
    <AuthProvider>

    <ImageProvider>
    <ReactRouter />
    
  </ImageProvider>
    
    </AuthProvider>
  

    {/* <NotFound /> */}
    </div>
  )
}

export default App;
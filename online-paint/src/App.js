import { useNavigate } from "react-router-dom";
import { useUser } from './hooks/useUser';
import { Navigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate();
  const user = useUser();
  if (!user) return <Navigate to='/signin' />
  return <Navigate to='/canvas' />
}
export default App;

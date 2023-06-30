import User from '../../models/User.js';
import userSignin from '../../schemas/auth/userSigninSchema.js';

const signin = async (req, res) => {
  try {
    // Validar los datos de entrada utilizando el validador y el esquema
    const { error } = userSignin.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(error => error.message)
      });
    }

    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email inválido' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Enviar los datos del usuario al cliente
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

export default signin;
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ erro: 'User already exists.' });
    }

    const user = await User.create(req.body);
    return res.status(201).json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      newPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      confirmPassword: Yup.string().when('newPassword', (newPassword, field) =>
        newPassword ? field.required().oneOf([Yup.ref('newPassword')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ erro: 'User already exists.' });
      }
    }

    if (password && !(await user.checkPassword(password))) {
      return res.status(401).json({ erro: 'Password does not match.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.status(200).json({ id, name, email, provider });
  }
}
export default new UserController();

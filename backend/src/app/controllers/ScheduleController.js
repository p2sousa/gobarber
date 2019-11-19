import { startOfDay, endOfDay, parseISO} from 'date-fns';
import {Op} from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const { page = 1, date} = req.query;
    const parseDate = parseISO(date);

    const checkUserProvider = User.findOne({
      where: {id: req.userId, provider: true}
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.'});
    }

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parseDate),
            endOfDay(parseDate),
          ]
        }
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();

import MatchRequest from '../models/MatchRequest.js';

export async function createMatchRequest(req, res) {
  const { location, type, date, timeSlot, requiredPlayers } = req.body;

  const match = await MatchRequest.create({
    host: req.user._id,
    location,
    type,
    date,
    timeSlot,
    requiredPlayers,
    currentPlayers: [req.user._id],
    status: 'open'
  });

  res.json({ msg: 'Match request created', match });
}

export async function findMatchRequests(req, res) {
  const { location, type, date, timeSlot } = req.query;

  const query = { status: 'open' };

  if (location) query.location = new RegExp(location, 'i');
  if (type) query.type = type;
  if (date) query.date = date;
  if (timeSlot) query.timeSlot = timeSlot;

  const matches = await MatchRequest.find(query).populate('host', 'name');
  res.json(matches);
}

export async function joinMatchRequest(req, res) {
  const match = await MatchRequest.findById(req.params.id);

  if (!match) return res.status(404).json({ msg: 'Match not found' });
  if (match.status !== 'open') return res.status(400).json({ msg: 'Match already closed' });
  if (match.currentPlayers.includes(req.user._id)) return res.status(400).json({ msg: 'Already joined' });

  match.currentPlayers.push(req.user._id);

  if (match.currentPlayers.length >= match.requiredPlayers) {
    match.status = 'matched';
    // Bạn có thể tự động tạo booking tại đây nếu muốn
  }

  await match.save();

  res.json({ msg: 'Joined match successfully', match });
}

let exaResults = null;

export default (req, res) => {
  if (req.method === 'POST') {
    exaResults = req.body;
    res.status(200).json({ status: 'success' });
  } else if (req.method === 'GET') {
    res.status(200).json(exaResults);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
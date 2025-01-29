const express = require('express');
const cors = require('cors');
const companiesRoutes = require('./routes/companies');
const formsRoutes = require('./routes/forms');
const authRoutes = require('./routes/auth');
const submissionsRoutes = require('./routes/submissions');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use('/api/companies', companiesRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

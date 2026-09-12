const home = require('./homeRoutes'); //khai báo homeRoutes để gọi đến file homeRoutes.js
const auth  = require('./authRoutes'); //khai báo authRoutes để gọi đến file authRoutes.js

function Routes(app) {
    app.use('/', home); // Sử dụng các route từ homeRoutes
    app.use('/auth', auth); // Sử dụng các route từ authRoutes
}
module.exports = Routes;
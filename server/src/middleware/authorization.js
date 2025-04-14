const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(400).json({ message: "Unauthorized: No role found" });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next()
    }
}

export default authorizeRole
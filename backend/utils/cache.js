import NodeCache from "node-cache";

// Shared in-memory cache – default TTL 5 minutes (300 s)
const cache = new NodeCache({ stdTTL: 300 });

export default cache;

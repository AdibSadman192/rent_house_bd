# Property Search System

## Overview
The search system provides advanced property search capabilities with filters, geolocation, and real-time updates.

## Features
- Full-text search
- Location-based search
- Price range filtering
- Property type filtering
- Amenities filtering
- Saved searches
- Search suggestions

## Technical Implementation

### Search Index
```javascript
// Elasticsearch mapping
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "bengali"
      },
      "description": {
        "type": "text",
        "analyzer": "bengali"
      },
      "location": {
        "type": "geo_point"
      },
      "price": {
        "type": "integer"
      },
      "propertyType": {
        "type": "keyword"
      },
      "amenities": {
        "type": "keyword"
      }
    }
  }
}
```

### Search Query Builder
```javascript
class SearchQueryBuilder {
  constructor() {
    this.query = {
      bool: {
        must: [],
        filter: []
      }
    };
  }

  addFullText(text) {
    if (text) {
      this.query.bool.must.push({
        multi_match: {
          query: text,
          fields: ['title^2', 'description']
        }
      });
    }
    return this;
  }

  addLocation(lat, lon, radius) {
    if (lat && lon) {
      this.query.bool.filter.push({
        geo_distance: {
          distance: `${radius}km`,
          location: {
            lat: lat,
            lon: lon
          }
        }
      });
    }
    return this;
  }

  addPriceRange(min, max) {
    if (min || max) {
      const range = {
        range: {
          price: {}
        }
      };
      if (min) range.range.price.gte = min;
      if (max) range.range.price.lte = max;
      this.query.bool.filter.push(range);
    }
    return this;
  }

  build() {
    return this.query;
  }
}
```

## API Endpoints

### GET /api/properties/search
Search properties with filters

Query Parameters:
- `q`: Search text
- `lat`: Latitude
- `lon`: Longitude
- `radius`: Search radius in km
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `propertyType`: Type of property
- `amenities`: Required amenities
- `page`: Page number
- `limit`: Results per page

Response:
```javascript
{
  results: [
    {
      id: String,
      title: String,
      description: String,
      price: Number,
      location: {
        lat: Number,
        lon: Number
      },
      propertyType: String,
      amenities: [String],
      images: [String],
      rating: Number
    }
  ],
  total: Number,
  page: Number,
  pages: Number
}
```

## Caching Strategy

1. Redis Cache Implementation
```javascript
class SearchCache {
  constructor(redis) {
    this.redis = redis;
    this.ttl = 3600; // 1 hour
  }

  async get(key) {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key, value) {
    await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      this.ttl
    );
  }

  generateKey(params) {
    return `search:${JSON.stringify(params)}`;
  }
}
```

2. Cache Invalidation
```javascript
class CacheInvalidator {
  static async invalidateProperty(propertyId) {
    // Clear related search caches
    const patterns = [
      `search:*`,
      `property:${propertyId}:*`
    ];
    await Promise.all(
      patterns.map(pattern => redis.del(pattern))
    );
  }
}
```

## Performance Optimization

1. Query Optimization
- Use compound indexes
- Implement cursor-based pagination
- Optimize geo-queries

2. Result Optimization
- Implement field selection
- Use projection to limit returned fields
- Compress response data

3. Caching
- Cache common searches
- Cache location data
- Cache aggregation results

## Error Handling

```javascript
class SearchError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function handleSearchError(error) {
  if (error instanceof SearchError) {
    return {
      error: true,
      code: error.code,
      message: error.message
    };
  }
  
  return {
    error: true,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  };
}
```

## Testing

1. Unit Tests
```javascript
describe('Search Query Builder', () => {
  it('should build full text query', () => {
    const builder = new SearchQueryBuilder();
    const query = builder
      .addFullText('apartment in dhaka')
      .build();
    expect(query).toMatchSnapshot();
  });
});
```

2. Integration Tests
```javascript
describe('Search API', () => {
  it('should return search results', async () => {
    const response = await request(app)
      .get('/api/properties/search')
      .query({
        q: 'apartment',
        lat: 23.8103,
        lon: 90.4125,
        radius: 5
      });
    
    expect(response.status).toBe(200);
    expect(response.body.results).toBeArray();
  });
});
```

## Monitoring

1. Search Analytics
```javascript
class SearchAnalytics {
  static async track(params, results) {
    await Analytics.create({
      type: 'search',
      params,
      resultCount: results.length,
      timestamp: new Date()
    });
  }
}
```

2. Performance Metrics
```javascript
class SearchMetrics {
  static async measure(searchId, duration) {
    await Metrics.create({
      type: 'search_performance',
      searchId,
      duration,
      timestamp: new Date()
    });
  }
}
```

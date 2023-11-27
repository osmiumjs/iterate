# @osmium/iterate - Examples

This document provides comprehensive examples of using `@osmium/iterate` in real-world scenarios.

## 📚 Table of Contents

- [Basic Iteration](#basic-iteration)
- [Data Transformation](#data-transformation)
- [Async Operations](#async-operations)
- [Parallel Processing](#parallel-processing)
- [Flow Control](#flow-control)
- [Mapping Strategies](#mapping-strategies)
- [Real-World Use Cases](#real-world-use-cases)

## Basic Iteration

### Iterating Arrays
```typescript
import { iterateSync } from '@osmium/iterate';

const numbers = [1, 2, 3, 4, 5];

// Simple iteration
iterateSync(numbers, (value, index) => {
    console.log(`numbers[${index}] = ${value}`);
});
// Output: numbers[0] = 1, numbers[1] = 2, etc.
```

### Iterating Objects
```typescript
const user = { name: 'John', age: 30, city: 'New York' };

iterateSync(user, (value, key) => {
    console.log(`${key}: ${value}`);
});
// Output: name: John, age: 30, city: New York
```

### Iterating Strings
```typescript
iterateSync('hello', (char, index) => {
    console.log(`Character ${index}: ${char}`);
});
// Output: Character 0: h, Character 1: e, etc.
```

### Iterating Numbers
```typescript
// Iterate 5 times (0 to 4)
iterateSync(5, (value, index) => {
    console.log(`Iteration ${index}: value is ${value}`);
});
// Output: Iteration 0: value is 1, Iteration 1: value is 2, etc.
```

## Data Transformation

### Array Transformation
```typescript
const numbers = [1, 2, 3, 4, 5];

// Double all numbers
const doubled = iterateSync(numbers, (x) => x * 2, []);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter and transform
const evenDoubled = iterateSync(numbers, (x) => {
    return x % 2 === 0 ? x * 2 : undefined;
}, []);
console.log(evenDoubled); // [4, 8]
```

### Object Transformation
```typescript
const users = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 }
];

// Create a lookup map
const userMap = iterateSync(users, (user, index, control) => {
    control.key(user.id); // Use user.id as the key
    return { name: user.name, age: user.age };
}, {});

console.log(userMap);
// { 1: { name: 'John', age: 25 }, 2: { name: 'Jane', age: 30 }, ... }
```

### Set Operations
```typescript
const numbers = [1, 2, 2, 3, 3, 4, 5];

// Create unique set of squares
const uniqueSquares = iterateSync(numbers, (x) => x * x, new Set());
console.log(uniqueSquares); // Set {1, 4, 9, 16, 25}
```

## Async Operations

### Basic Async Iteration
```typescript
import { iterateAsync } from '@osmium/iterate';

const urls = [
    'https://api.example.com/users/1',
    'https://api.example.com/users/2',
    'https://api.example.com/users/3'
];

await iterateAsync(urls, async (url, index) => {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    const data = await response.json();
    console.log(`User ${index + 1}:`, data.name);
});
```

### Async Data Processing
```typescript
const files = ['data1.json', 'data2.json', 'data3.json'];

const processedData = await iterateAsync(files, async (filename) => {
    const content = await fs.readFile(filename, 'utf8');
    const data = JSON.parse(content);
    
    // Process the data
    return {
        filename,
        recordCount: data.length,
        processedAt: new Date().toISOString()
    };
}, []);

console.log(processedData);
```

## Parallel Processing

### Basic Parallel Execution
```typescript
import { iterateParallel } from '@osmium/iterate';

const urls = [
    'https://api.example.com/data/1',
    'https://api.example.com/data/2',
    'https://api.example.com/data/3'
];

// All requests happen in parallel
const results = await iterateParallel(urls, async (url) => {
    const response = await fetch(url);
    return await response.json();
}, []);

console.log('All requests completed:', results);
```

### Limited Parallel Processing
```typescript
import { iterateParallelLimit } from '@osmium/iterate';

const imageUrls = [
    'image1.jpg', 'image2.jpg', 'image3.jpg', 
    'image4.jpg', 'image5.jpg', 'image6.jpg'
];

// Process max 2 images at a time to avoid overwhelming the server
await iterateParallelLimit(2, imageUrls, async (imageUrl) => {
    console.log(`Processing ${imageUrl}...`);
    const processedImage = await processImage(imageUrl);
    await saveImage(processedImage);
    console.log(`Completed ${imageUrl}`);
});
```

### Batch Processing with Ranges
```typescript
import { seriesPageableRange, iterateParallel } from '@osmium/iterate';

// Process 10,000 records in batches of 100
const totalRecords = 10000;
const batchSize = 100;

const ranges = seriesPageableRange(0, totalRecords, batchSize);

await iterateParallel(ranges, async ([start, end]) => {
    console.log(`Processing records ${start} to ${end}...`);
    const records = await fetchRecords(start, end);
    await processRecords(records);
    console.log(`Completed batch ${start}-${end}`);
});
```

## Flow Control

### Breaking Early
```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

iterateSync(numbers, (value, index, control) => {
    console.log(value);
    
    if (value === 5) {
        console.log('Breaking at 5');
        control.break();
    }
});
// Output: 1, 2, 3, 4, 5, "Breaking at 5"
```

### Skipping Items
```typescript
const numbers = [1, 2, 3, 4, 5];

const evenNumbers = iterateSync(numbers, (value, index, control) => {
    if (value % 2 !== 0) {
        control.skip(); // Skip odd numbers
        return;
    }
    return value;
}, []);

console.log(evenNumbers); // [2, 4]
```

### Repeating Iterations
```typescript
let retryCount = 0;

iterateSync(['task1', 'task2', 'task3'], (task, index, control) => {
    try {
        console.log(`Executing ${task}...`);
        // Simulate task that might fail
        if (Math.random() < 0.3 && retryCount < 2) {
            retryCount++;
            console.log(`${task} failed, retrying... (attempt ${retryCount})`);
            control.repeat();
            return;
        }
        
        console.log(`${task} completed successfully`);
        retryCount = 0; // Reset for next task
    } catch (error) {
        console.error(`${task} failed:`, error);
    }
});
```

### Position Shifting
```typescript
const items = ['a', 'b', 'c', 'd', 'e'];

iterateSync(items, (value, index, control) => {
    console.log(`Processing: ${value} at index ${index}`);
    
    if (value === 'b') {
        console.log('Skipping ahead by 2 positions');
        control.shift(2); // Skip 'c' and 'd'
    }
});
// Output: Processing: a at index 0, Processing: b at index 1, Processing: e at index 4
```

## Mapping Strategies

### Custom Key Mapping
```typescript
const products = [
    { sku: 'ABC123', name: 'Widget A', price: 10 },
    { sku: 'DEF456', name: 'Widget B', price: 20 },
    { sku: 'GHI789', name: 'Widget C', price: 30 }
];

// Create a map with SKU as key
const productMap = iterateSync(products, (product, index, control) => {
    control.key(product.sku); // Use SKU as the map key
    return {
        name: product.name,
        price: product.price
    };
}, new Map());

console.log(productMap.get('ABC123')); // { name: 'Widget A', price: 10 }
```

### Boolean Flag Mapping
```typescript
const numbers = [1, 3, 5, 7, 8, 9];

// Check if any number is even
const hasEven = iterateSync(numbers, (num) => num % 2 === 0, false);
console.log(hasEven); // true (because of 8)

// Check if all numbers are positive
const allPositive = iterateSync(numbers, (num) => num <= 0, true);
console.log(allPositive); // false (flips to false when callback returns truthy)
```

### Counter Mapping
```typescript
const data = [1, undefined, 3, null, 5, undefined, 7];

// Count non-undefined values
const validCount = iterateSync(data, (value) => {
    return value !== undefined ? value : undefined;
}, 0);

console.log(validCount); // 5
```

## Real-World Use Cases

### File Processing Pipeline
```typescript
import { iterateParallelLimit, iterateSync } from '@osmium/iterate';
import * as fs from 'fs/promises';
import * as path from 'path';

async function processImageDirectory(directoryPath: string) {
    // Get all image files
    const files = await fs.readdir(directoryPath);
    const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images to process`);
    
    // Process images in batches of 3
    const results = await iterateParallelLimit(3, imageFiles, async (filename) => {
        const inputPath = path.join(directoryPath, filename);
        const outputPath = path.join(directoryPath, 'processed', filename);
        
        try {
            console.log(`Processing ${filename}...`);
            
            // Simulate image processing
            const imageData = await fs.readFile(inputPath);
            const processedData = await processImage(imageData);
            
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, processedData);
            
            return { filename, status: 'success', size: processedData.length };
        } catch (error) {
            console.error(`Failed to process ${filename}:`, error);
            return { filename, status: 'error', error: error.message };
        }
    }, []);
    
    // Generate summary
    const summary = iterateSync(results, (result, index, control) => {
        const status = result.status;
        control.key(status);
        return 1;
    }, { success: 0, error: 0 });
    
    console.log('Processing complete:', summary);
    return results;
}
```

### API Data Aggregation
```typescript
import { iterateParallel, iterateSync } from '@osmium/iterate';

async function aggregateUserData(userIds: number[]) {
    // Fetch user data in parallel
    const users = await iterateParallel(userIds, async (userId) => {
        const [profile, posts, followers] = await Promise.all([
            fetch(`/api/users/${userId}/profile`).then(r => r.json()),
            fetch(`/api/users/${userId}/posts`).then(r => r.json()),
            fetch(`/api/users/${userId}/followers`).then(r => r.json())
        ]);
        
        return {
            id: userId,
            profile,
            postCount: posts.length,
            followerCount: followers.length
        };
    }, []);
    
    // Aggregate statistics
    const stats = iterateSync(users, (user) => {
        return {
            posts: user.postCount,
            followers: user.followerCount
        };
    }, { totalPosts: 0, totalFollowers: 0, userCount: 0 });
    
    // Calculate averages
    stats.avgPosts = stats.totalPosts / stats.userCount;
    stats.avgFollowers = stats.totalFollowers / stats.userCount;
    
    return { users, stats };
}
```

### Database Migration
```typescript
import { seriesPageableRange, iterateAsync } from '@osmium/iterate';

async function migrateUserData() {
    const totalUsers = await getUserCount();
    const batchSize = 1000;
    
    // Process users in batches
    const ranges = seriesPageableRange(0, totalUsers, batchSize);
    
    let processedCount = 0;
    
    await iterateAsync(ranges, async ([start, end]) => {
        console.log(`Migrating users ${start} to ${end}...`);
        
        // Fetch batch of users
        const users = await fetchUsers(start, end);
        
        // Transform and migrate each user
        await iterateAsync(users, async (user) => {
            try {
                const transformedUser = transformUserData(user);
                await insertUserToNewDB(transformedUser);
                processedCount++;
                
                if (processedCount % 100 === 0) {
                    console.log(`Processed ${processedCount}/${totalUsers} users`);
                }
            } catch (error) {
                console.error(`Failed to migrate user ${user.id}:`, error);
                // Log error but continue with other users
            }
        });
        
        console.log(`Completed batch ${start}-${end}`);
    });
    
    console.log(`Migration complete. Processed ${processedCount} users.`);
}
```

### Log Analysis
```typescript
import { iterateSync, iterateAsync } from '@osmium/iterate';

async function analyzeLogFiles(logFiles: string[]) {
    const analysis = {
        totalLines: 0,
        errorCount: 0,
        warningCount: 0,
        ipAddresses: new Set(),
        statusCodes: new Map(),
        hourlyTraffic: new Array(24).fill(0)
    };
    
    await iterateAsync(logFiles, async (filename) => {
        console.log(`Analyzing ${filename}...`);
        
        const content = await fs.readFile(filename, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        iterateSync(lines, (line) => {
            analysis.totalLines++;
            
            // Parse log line (simplified)
            const match = line.match(/^(\S+) .* \[([^\]]+)\] ".*" (\d+) .*/);
            if (!match) return;
            
            const [, ip, timestamp, statusCode] = match;
            
            // Track IP addresses
            analysis.ipAddresses.add(ip);
            
            // Track status codes
            const count = analysis.statusCodes.get(statusCode) || 0;
            analysis.statusCodes.set(statusCode, count + 1);
            
            // Track hourly traffic
            const hour = new Date(timestamp).getHours();
            analysis.hourlyTraffic[hour]++;
            
            // Count errors and warnings
            if (statusCode.startsWith('4') || statusCode.startsWith('5')) {
                analysis.errorCount++;
            }
            if (line.includes('WARN')) {
                analysis.warningCount++;
            }
        });
    });
    
    return {
        ...analysis,
        uniqueIPs: analysis.ipAddresses.size,
        topStatusCodes: Array.from(analysis.statusCodes.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
    };
}
```

These examples demonstrate the versatility and power of `@osmium/iterate` in handling various real-world scenarios efficiently and elegantly.
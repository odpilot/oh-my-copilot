/**
 * Batch Processor
 * Process items in batches with concurrency control
 */

export interface BatchOptions {
  concurrency: number;
  delayBetweenBatches?: number;
  onProgress?: (completed: number, total: number) => void;
  onError?: (error: Error, item: any) => 'skip' | 'abort' | 'retry';
}

export class BatchProcessor {
  static async process<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: BatchOptions
  ): Promise<Array<{ item: T; result?: R; error?: Error }>> {
    const { 
      concurrency, 
      delayBetweenBatches = 0, 
      onProgress,
      onError = () => 'skip' as const
    } = options;
    
    const results: Array<{ item: T; result?: R; error?: Error }> = [];
    let completed = 0;
    
    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const result = await processor(item);
            return { item, result };
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            const action = onError(err, item);
            
            if (action === 'abort') {
              throw err;
            }
            
            return { item, error: err };
          }
        })
      );
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
        completed++;
        onProgress?.(completed, items.length);
      }
      
      if (delayBetweenBatches > 0 && i + concurrency < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    return results;
  }
}

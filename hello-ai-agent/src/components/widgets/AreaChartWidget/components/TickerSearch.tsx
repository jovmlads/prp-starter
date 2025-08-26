import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CoinInfo } from '../types';
import { getPopularCoins, fetchCoinsList } from '../services/chartDataApi';
import { searchCoins } from '../utils/chartHelpers';

interface TickerSearchProps {
  value?: string;
  onSelect: (tickerId: string) => void;
  className?: string;
}

export function TickerSearch({
  value,
  onSelect,
  className,
}: TickerSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [allCoins, setAllCoins] = useState<CoinInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with popular coins
  useEffect(() => {
    setAllCoins(getPopularCoins());

    // Try to fetch full list in background
    const fetchFullList = async () => {
      setIsLoading(true);
      try {
        const coins = await fetchCoinsList();
        setAllCoins((prev) => {
          // Merge popular coins with full list, avoiding duplicates
          const popularIds = new Set(prev.map((coin) => coin.id));
          const newCoins = coins.filter((coin) => !popularIds.has(coin.id));
          return [...prev, ...newCoins];
        });
      } catch (error) {
        console.warn(
          'Failed to fetch full coins list, using popular coins only'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullList();
  }, []);

  // Filter coins based on search
  const filteredCoins = useMemo(() => {
    return searchCoins(allCoins, search).slice(0, 50); // Limit to 50 results for performance
  }, [allCoins, search]);

  // Find current coin info
  const selectedCoin = useMemo(() => {
    return allCoins.find((coin) => coin.id === value);
  }, [allCoins, value]);

  const handleSelect = (coinId: string) => {
    onSelect(coinId);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left">
              {selectedCoin ? (
                <span>
                  <span className="font-medium">{selectedCoin.symbol}</span>
                  <span className="text-muted-foreground ml-1">
                    • {selectedCoin.name}
                  </span>
                </span>
              ) : (
                'Search cryptocurrency...'
              )}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search cryptocurrency..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? 'Loading cryptocurrencies...'
                : 'No cryptocurrency found.'}
            </CommandEmpty>
            <CommandGroup>
              {filteredCoins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.id}
                  onSelect={() => handleSelect(coin.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{coin.symbol}</span>
                    <span className="text-sm text-muted-foreground">
                      {coin.name}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === coin.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

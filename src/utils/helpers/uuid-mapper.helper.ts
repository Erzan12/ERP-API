import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * Returns a @Transform decorator that maps friendly names to UUIDs.
 * @param map - key: friendly name, value: UUID string
 * @param propertyName - optional property name for error messages
 */

export function MapFriendlyNameToUUID(
  map: Record<string, string>,
  propertyName?: string,
) {
  return Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string' || !value) {
      throw new BadRequestException(`${propertyName || 'value'} is required`);
    }

    if (value in map) return map[value];

    throw new BadRequestException(
      `Invalid ${propertyName || 'value'}: ${value}. Allowed values: ${Object.keys(map).join(', ')}`,
    );
  });
}

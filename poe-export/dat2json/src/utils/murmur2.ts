const _encoder = new TextEncoder();

export function murmur64a(data: string) {
  const hashHex = MurmurHash64A(_encoder.encode(data))
    .toString(16)
    .padStart(16, "0");
  return [
    parseInt(hashHex.slice(14, 16), 16),
    parseInt(hashHex.slice(12, 14), 16),
    parseInt(hashHex.slice(10, 12), 16),
    parseInt(hashHex.slice(8, 10), 16),
    parseInt(hashHex.slice(6, 8), 16),
    parseInt(hashHex.slice(4, 6), 16),
    parseInt(hashHex.slice(2, 4), 16),
    parseInt(hashHex.slice(0, 2), 16),
  ];
}

function MurmurHash64A(data8: Uint8Array, seed = BigInt("0x1337b33f")) {
  const m = BigInt("0xc6a4a7935bd1e995");
  const r = BigInt("47");

  let h = seed ^ BigInt.asUintN(64, BigInt(data8.length) * m);

  const remainder = data8.length & 7;
  const alignedLength = data8.length - remainder;

  const data64 = new BigUint64Array(data8.buffer, 0, alignedLength / 8);
  for (let k of data64.values()) {
    k = BigInt.asUintN(64, k * m);
    k ^= k >> r;
    k = BigInt.asUintN(64, k * m);

    h ^= k;
    h = BigInt.asUintN(64, h * m);
  }

  switch (remainder) {
    case 7:
      h ^= BigInt(data8[alignedLength + 6]) << BigInt("48");
    case 6:
      h ^= BigInt(data8[alignedLength + 5]) << BigInt("40");
    case 5:
      h ^= BigInt(data8[alignedLength + 4]) << BigInt("32");
    case 4:
      h ^= BigInt(data8[alignedLength + 3]) << BigInt("24");
    case 3:
      h ^= BigInt(data8[alignedLength + 2]) << BigInt("16");
    case 2:
      h ^= BigInt(data8[alignedLength + 1]) << BigInt("8");
    case 1:
      h ^= BigInt(data8[alignedLength + 0]) << BigInt("0");
      h = BigInt.asUintN(64, h * m);
  }

  h ^= h >> r;
  h = BigInt.asUintN(64, h * m);
  h ^= h >> r;

  return h;
}

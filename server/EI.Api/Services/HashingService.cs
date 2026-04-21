using System.Security.Cryptography;
using System.Text;
using EI.Api.Interfaces;

namespace EI.Api.Services;

public class HashingService : IHashingService
{
    private readonly byte[] _privateNumberKey;
    private readonly byte[] _mobileNumberKey;

    public HashingService(IConfiguration config)
    {
        var pn = config["Hashing:PrivateNumberKey"]
                 ?? throw new InvalidOperationException("Hashing:PrivateNumberKey is not configured.");
        var mn = config["Hashing:MobileNumberKey"]
                 ?? throw new InvalidOperationException("Hashing:MobileNumberKey is not configured.");

        _privateNumberKey = DeriveAesKey(pn);
        _mobileNumberKey  = DeriveAesKey(mn);
    }

    public string HashPrivateNumber(string value)   => Encrypt(_privateNumberKey, value);
    public string HashMobileNumber(string value)    => Encrypt(_mobileNumberKey, value);
    public string DeHashPrivateNumber(string value) => Decrypt(_privateNumberKey, value);
    public string DeHashMobileNumber(string value)  => Decrypt(_mobileNumberKey, value);

    private static byte[] DeriveAesKey(string secret) =>
        SHA256.HashData(Encoding.UTF8.GetBytes(secret));

    private static string Encrypt(byte[] key, string plaintext)
    {
        using var aes = Aes.Create();
        aes.Key     = key;
        aes.Mode    = CipherMode.ECB;
        aes.Padding = PaddingMode.PKCS7;

        using var encryptor = aes.CreateEncryptor();
        var bytes      = Encoding.UTF8.GetBytes(plaintext);
        var ciphertext = encryptor.TransformFinalBlock(bytes, 0, bytes.Length);
        return Convert.ToHexString(ciphertext).ToLowerInvariant();
    }

    private static string Decrypt(byte[] key, string hex)
    {
        using var aes = Aes.Create();
        aes.Key     = key;
        aes.Mode    = CipherMode.ECB;
        aes.Padding = PaddingMode.PKCS7;

        using var decryptor = aes.CreateDecryptor();
        var ciphertext = Convert.FromHexString(hex);
        var bytes      = decryptor.TransformFinalBlock(ciphertext, 0, ciphertext.Length);
        return Encoding.UTF8.GetString(bytes);
    }
}

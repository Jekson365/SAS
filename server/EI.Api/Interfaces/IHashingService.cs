namespace EI.Api.Interfaces;

public interface IHashingService
{
    string HashPrivateNumber(string value);
    string HashMobileNumber(string value);
    string DeHashPrivateNumber(string value);
    string DeHashMobileNumber(string value);
}

namespace cuel_mp_be.Common;

public class ApiException : Exception
{
    public int Status { get; }
    public object? Details { get; }
    public ApiException(int status, string message, object? details = null) : base(message)
    {
        Status = status;
        Details = details;
    }

    public static ApiException BadRequest(string m, object? d = null) => new(400, m, d);
    public static ApiException Unauthorized(string m = "Unauthorized")  => new(401, m);
    public static ApiException Forbidden(string m = "Forbidden")        => new(403, m);
    public static ApiException NotFound(string m = "Not Found")         => new(404, m);
    public static ApiException Conflict(string m)                       => new(409, m);
}

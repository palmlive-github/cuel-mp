using System;
using System.Collections.Generic;

namespace cuel_mp_be.Enttities;

public partial class ContextEnttities : Enttities.UserInfo
{
    public ContextEnttities(IDictionary<object, object?> lem)
    {
        PersonID = ConvertValue<int>(lem["PersonID"]);
        UserID = ConvertValue<int>(lem["UserID"]);
        UserName = ConvertValue<string>(lem["UserName"]) ?? string.Empty;
        EmployeeNo = ConvertValue<string>(lem["EmployeeNo"]) ?? string.Empty;
        FirstName = ConvertValue<string>(lem["FirstName"]) ?? string.Empty;
        LastName = ConvertValue<string>(lem["LastName"]) ?? string.Empty;
        Email = ConvertValue<string>(lem["Email"]) ?? string.Empty;
        Position = ConvertValue<string>(lem["Position"]) ?? string.Empty;
        Department = ConvertValue<string>(lem["Department"]) ?? string.Empty;
        Roles = ConvertValue<string[]>(lem["Roles"]) ?? Array.Empty<string>();;

        // DeviceType = ConvertValue<string>(lem["DeviceType"]);
        // OS = ConvertValue<string>(lem["OS"]);
        // Browser = ConvertValue<string>(lem["Browser"]);
        // City = ConvertValue<string>(lem["City"]);
        // Country = ConvertValue<string>(lem["Country"]);

        DateNow = DateTime.Now;
    }

    private T? ConvertValue<T>(object? value)
    {
        if (value == null) return default(T);
        else return (T)value;
    }

    // public int Id { get; set; }
    // public int UserID { get; set; }
    // public string UserName { get; set; } = default!;
    // public string EmployeeNo { get; set; } = default!;
    // public string FirstName { get; set; } = default!;
    // public string LastName { get; set; } = default!;
    // public string Email { get; set; } = default!;
    // public string Position { get; set; } = default!;
    // public string Department { get; set; } = default!;
    // public string[] Roles { get; set; } = Array.Empty<string>();

    // public string DeviceType { get; set; }
    // public string OS { get; set; }
    // public string Browser { get; set; }
    // public string City { get; set; }
    // public string Country { get; set; }
    
    public DateTime DateNow { get; set; }
}

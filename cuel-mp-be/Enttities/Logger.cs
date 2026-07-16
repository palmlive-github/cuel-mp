using System.ComponentModel.DataAnnotations;

namespace cuel_mp_be.Enttities;

public class Logger<T>
{
    public string Number { get; set; } = null!;
    public string DeviceType { get; set; } = null!;
    public string OS { get; set; } = null!;
    public string Browser { get; set; } = null!;
    public string City { get; set; } = null!;
    public string CountryName { get; set; } = null!;
    public bool Error { get; set; }
    public string Message { get; set; } = null!;
    public T? Datas { get; set; }
    public DateTime Date { get; set; }

    public void SetDatas(T datas)
    {
        Datas = datas;
    }
}

    public enum LoggerAction
    {
        CREATE,
        UPDATE,
        SUBMIT,
        APPROVE,
        REJECT,
        CANCEL,
    }
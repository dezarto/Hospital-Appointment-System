namespace HRS.Application.DTOs
{
    public class UpdatePassword
    {
        public string? Hasta_TC { get; set; }
        public string? Doktor_TC { get; set; }
        public string CurrentPassword { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}

﻿namespace UnderGroundArchive_Backend.DTO
{
    public class UserRegistrationDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime BirthDate { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }
        public decimal Balance { get; set; } = 0m;
        public int SubscriptionId { get; set; } = 1;
        public int RankId { get; set; } = 1;
    }
}

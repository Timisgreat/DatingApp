using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            this._mapper = mapper;
            this._tokenService = tokenService;
            this._context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) //public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");    
            
            var user = _mapper.Map<AppUser>(registerDto);

            using var hmac = new HMACSHA512();
            
            
                user.UserName = registerDto.Username.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
                user.PasswordSalt = hmac.Key;                
            

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
                        
            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user), 
                KnowAs = user.KnownAs               
            };
            //return user;            
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login (LoginDto loginDto) //public async Task<ActionResult<AppUser>> Login (LoginDto loginDto)
        {
            Console.WriteLine("AccountController");

            
            //var user = await _context.Users.SingleOrDefaultAsync(x=>x.UserName == loginDto.Username);
            var user = await _context.Users
                .Include(p=>p.Photo)
                .SingleOrDefaultAsync(x=>x.UserName == loginDto.Username);

            
            if (user == null) return Unauthorized("Invalid username");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password)); 
            for (int i =0; i< ComputeHash.Length; i++){
                if (ComputeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }
            
            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photo.FirstOrDefault(x=>x.IsMain)?.Url,
                KnowAs = user.KnownAs
            };
            //return user;
        }

        private  async Task<bool> UserExists(string username){
            return await _context.Users.AnyAsync(x=>x.UserName == username.ToLower());    
        }
        
        

    }
}
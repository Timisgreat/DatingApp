using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{   [Authorize] 
    public class UsersController : BaseApiController
    {
        //private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        
        public UsersController(IUserRepository userRepository, IMapper mapper){   // public UsersController(IUserRepository userRepository) //public UsersController(DataContext context){
            this._mapper = mapper;
            this._userRepository = userRepository;
            //this._context = context;
        }

        [HttpGet]        
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(){  // public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()//public ActionResult<IEnumerable<AppUser>> GetUsers(){
            
            var users = await _userRepository.GetMembersAsync(); //var users = await _userRepository.GetUserAsync();
            //var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users); //return Ok(usersToReturn);  // return Ok(await _userRepository.GetUserAsync()); // return await _context.Users.ToListAsync(); //return _context.Users.ToList();            
        }
        
        [HttpGet("{username}")]  // [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){ // public async Task<ActionResult<AppUser>> GetUser(string username) // public async Task<ActionResult<AppUser>> GetUser(int id) //public ActionResult<AppUser> GetUser(int id){
            return await _userRepository.GetMemberAsync(username); //var user = await _userRepository.GetUserByUsernameAsync(username);
            
            //return _mapper.Map<MemberDto>(user);  // return await _userRepository.GetUserByUsernameAsync(username);//return await _context.Users.FindAsync(id); //return _context.Users.Find(id);            
        }
    }
}
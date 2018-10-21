#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

using namespace eosio;

using std::string;

class eostodo : public eosio::contract {
  public:
    using contract::contract;

        /// @abi action
        void create( uint64_t id, account_name user, string data ) {
            todos todostable( _self, id );
            auto existing = todostable.find( id );
            eosio_assert( existing == todostable.end(), "record with that ID already exists" );
            eosio_assert( data.size() <= 256, "data has more than 256 bytes" );

            todostable.emplace( _self, [&]( auto& s ) {
               s.id         = id;
               s.owner      = user;
               s.data       = data;
               s.status     = 0;
            });

            print( "Hello, ", name{user} );
            print( "Task created with data: ", data );
        }


        /// @abi action
        void complete( uint64_t id) {

            todos todostable( _self, id );
            auto existing = todostable.find( id );
            eosio_assert( existing != todostable.end(), "record with that ID does not exist" );
            const auto& st = *existing;

            todostable.modify( st, 0, [&]( auto& s ) {
               s.status = 1;
            });

            print("Task completed: ", id);
        }

        /// @abi action
        void destroy( uint64_t id ) {
            todos todostable( _self, id );
            auto existing = todostable.find( id );
            eosio_assert( existing != todostable.end(), "record with that ID does not exist" );
            const auto& st = *existing;

            todostable.erase( st );

            print("Task destroyed: ", id);

        }

  private:
    /// @abi table
    struct todo {
       uint64_t        id;
       account_name    owner;
       string          data;
       uint32_t        status; // 0 == not complete, 1 == completed
       uint64_t primary_key()const { return id; }
    };

    typedef eosio::multi_index<N(todo), todo> todos;
 };


EOSIO_ABI( eostodo, (create)(complete)(destroy) )